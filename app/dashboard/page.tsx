import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import AddBookmarkForm from '@/components/AddBookmarkForm';
import BookmarkList from '@/components/BookmarkList';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <UserProvider user={user}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">My Bookmarks</h2>
            <p className="text-gray-600">Manage and organize your favorite links</p>
          </div>
          <AddBookmarkForm />
          <BookmarkList />
        </main>
      </div>
    </UserProvider>
  );
}
