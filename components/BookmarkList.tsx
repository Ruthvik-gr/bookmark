'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bookmark } from '@/lib/types';
import BookmarkItem from './BookmarkItem';
import EditBookmarkModal from './EditBookmarkModal';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useUser } from '@/contexts/UserContext';

export default function BookmarkList() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const supabase = createClient();

  const handleDelete = (bookmarkId: string) => {
    setBookmarks((current) => current.filter((b) => b.id !== bookmarkId));
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error);
      } else {
        setBookmarks(data || []);
      }
      setLoading(false);
    };

    fetchBookmarks();

    const channel: RealtimeChannel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, supabase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first bookmark above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={setEditingBookmark}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <EditBookmarkModal
        bookmark={editingBookmark}
        onClose={() => setEditingBookmark(null)}
      />
    </>
  );
}
