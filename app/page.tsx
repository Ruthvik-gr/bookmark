import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignInButton from '@/components/SignInButton';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl w-full">
          {/* Hero text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-600 mb-6 leading-tight">
              Smart Bookmark
              <br />
              Manager
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-4 max-w-2xl mx-auto font-medium">
              Never lose track of your favorite links again
            </p>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
              Organize, manage, and sync your bookmarks in real-time across all your devices with our beautiful and intuitive interface.
            </p>
          </div>

          {/* Sign in card */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-indigo-100">
              <SignInButton />
              <p className="text-center text-sm text-gray-500 mt-4">
                Secure authentication with your Google account
              </p>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-indigo-100">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Sync</h3>
              <p className="text-gray-600 text-sm">
                Your bookmarks update instantly across all your browser tabs
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-gray-600 text-sm">
                Your bookmarks are encrypted and only accessible by you
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-indigo-100">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Management</h3>
              <p className="text-gray-600 text-sm">
                Add, edit, and delete bookmarks with a beautiful interface
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Next.js, Supabase & Tailwind CSS</p>
        </div>
      </div>
    </main>
  );
}
