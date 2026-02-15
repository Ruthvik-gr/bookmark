'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export default function AddBookmarkForm() {
  const { user } = useUser();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert([
          { url, title, user_id: user.id }
        ]);

      if (error) throw error;

      setUrl('');
      setTitle('');
      toast.success('Bookmark added successfully!');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast.error('Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-indigo-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Add New Bookmark</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="My Favorite Website"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="https://example.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </form>
    </div>
  );
}
