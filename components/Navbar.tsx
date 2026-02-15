'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-sm border-b-2 border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-indigo-600">
              Smart Bookmarks
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
