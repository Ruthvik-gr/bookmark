'use client';

import { Bookmark } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookmarkItem({
  bookmark,
  onEdit,
  onDelete
}: {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmarkId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    setDeleting(true);
    onDelete(bookmark.id);

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmark.id);

    if (error) {
      console.error('Error deleting bookmark:', error);
      toast.error('Failed to delete bookmark');
      setDeleting(false);
    } else {
      toast.success('Bookmark deleted successfully');
    }
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-200 border-2 border-indigo-100 hover:border-indigo-300">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex-1"
          >
            {bookmark.title}
          </a>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(bookmark)}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-1 hover:bg-indigo-50 rounded-lg"
              title="Edit bookmark"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-gray-600 hover:text-red-600 transition-colors p-1 disabled:opacity-50 hover:bg-red-50 rounded-lg"
              title="Delete bookmark"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-700 break-all"
        >
          {truncateUrl(bookmark.url)}
        </a>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Added {new Date(bookmark.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
