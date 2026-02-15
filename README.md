# Smart Bookmark App

A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication and real-time synchronization across browser tabs.

## Features

- **Google OAuth Authentication** - Secure login using Google accounts only (no passwords)
- **Add Bookmarks** - Save URLs with custom titles
- **Edit Bookmarks** - Update existing bookmark titles and URLs
- **Delete Bookmarks** - Remove unwanted bookmarks with confirmation
- **Real-time Sync** - Bookmarks update instantly across all open tabs (same device)
- **Private Data** - Each user can only see and manage their own bookmarks
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn
- A Supabase account
- A Google Cloud account (for OAuth credentials)
- A Vercel account (for deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following schema:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create RLS policies
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table bookmarks;
```

3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public Key

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. For **Authorized redirect URIs**, add:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

8. In Supabase:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Paste your Client ID and Client Secret
   - Save

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Make sure your repository is **public**.

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Update OAuth Redirect URLs

After deployment:

1. Copy your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Go to **Google Cloud Console** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `https://your-app.vercel.app/api/auth/callback`
5. Save

6. In Supabase:
   - Go to **Authentication** → **URL Configuration**
   - Add your Vercel URL to **Redirect URLs**:
     - `https://your-app.vercel.app/api/auth/callback`

## Testing the Application

### Authentication Flow
1. Visit your deployed URL
2. Click "Sign in with Google"
3. Authorize the application
4. You should be redirected to the dashboard

### Adding Bookmarks
1. Enter a title and URL in the form
2. Click "Add Bookmark"
3. The bookmark should appear immediately

### Real-time Sync Test
1. Open the app in two browser tabs
2. Add a bookmark in tab 1
3. Verify it appears in tab 2 without refreshing
4. Edit a bookmark in tab 2
5. Verify changes appear in tab 1
6. Delete a bookmark in tab 1
7. Verify it disappears in tab 2

### Privacy Test
1. Sign in with one Google account
2. Add some bookmarks
3. Sign out
4. Sign in with a different Google account
5. Verify you only see bookmarks for the current account

## Problems Encountered and Solutions

### 1. Supabase RLS Policy Configuration

**Problem**: Users could see other users' bookmarks or couldn't create bookmarks at all.

**Solution**: Implemented Row Level Security (RLS) policies with proper `auth.uid()` checks:
- Used `using (auth.uid() = user_id)` for SELECT, UPDATE, and DELETE
- Used `with check (auth.uid() = user_id)` for INSERT
- Ensured RLS is enabled on the bookmarks table

### 2. OAuth Redirect URL Configuration

**Problem**: After Google login, users got errors or were redirected to wrong URLs.

**Solution**:
- Added the exact callback URL to Google Cloud Console authorized redirect URIs
- Configured Supabase redirect URLs to match the deployment environment
- Used `${window.location.origin}/api/auth/callback` for dynamic redirect handling in development and production

### 3. Real-time Subscription Cleanup

**Problem**: Memory leaks and duplicate subscriptions when components re-rendered.

**Solution**:
- Implemented proper cleanup in useEffect return function
- Used `supabase.removeChannel(channel)` to unsubscribe when component unmounts
- Stored channel reference to ensure correct cleanup

### 4. Cookie-based Session Management in Next.js App Router

**Problem**: Session not persisting across page navigation or refreshes.

**Solution**:
- Used `@supabase/ssr` package with proper cookie handling
- Implemented separate client and server Supabase clients
- Server client uses `cookies()` from Next.js for server-side session access
- Client uses `createBrowserClient` for client-side operations

### 5. Environment Variable Configuration for Vercel

**Problem**: App worked locally but failed in production due to missing environment variables.

**Solution**:
- Added all environment variables in Vercel dashboard under Project Settings
- Used `NEXT_PUBLIC_` prefix for client-side accessible variables
- Redeployed after adding environment variables
- Verified variables were properly set using Vercel's environment variable UI

### 6. TypeScript Type Safety with Supabase

**Problem**: TypeScript errors when working with Supabase queries and realtime updates.

**Solution**:
- Created a `Database` type that mirrors the Supabase schema
- Used typed clients: `createBrowserClient<Database>` and `createServerClient<Database>`
- Defined `Bookmark` type with proper field types
- Cast realtime payload data to correct types

### 7. Tailwind CSS v4 PostCSS Plugin Error

**Problem**: Build error: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin."

**Solution**:
- Installed `@tailwindcss/postcss` package
- Updated `postcss.config.mjs` to use `'@tailwindcss/postcss'` instead of `'tailwindcss'`
- Changed CSS imports from `@tailwind` directives to `@import "tailwindcss"`
- Removed `tailwind.config.ts` as Tailwind v4 uses CSS-first configuration
- Used `@theme` directive in CSS for custom theme values

### 8. Supabase TypeScript Type Inference in Next.js Build

**Problem**: TypeScript build errors: "No overload matches this call" for `.insert()` and `.update()` operations, even with properly typed Database schema.

**Solution**:
- Added `// @ts-expect-error` comments before `.insert()` and `.update()` calls
- This is a known issue with Supabase type inference in Next.js builds
- The runtime functionality works correctly; this is purely a TypeScript compilation issue
- Alternative would be using `as any` type assertion, but `@ts-expect-error` is more explicit

## Project Structure

```
bookmark-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts       # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx               # Main dashboard (protected)
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing/login page
├── components/
│   ├── AddBookmarkForm.tsx        # Add bookmark form
│   ├── BookmarkItem.tsx           # Individual bookmark card
│   ├── BookmarkList.tsx           # List with real-time updates
│   ├── EditBookmarkModal.tsx      # Edit bookmark modal
│   ├── Navbar.tsx                 # Navigation with logout
│   └── SignInButton.tsx           # Google sign-in button
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   └── server.ts              # Server Supabase client
│   └── types.ts                   # TypeScript types
├── .env.local.example             # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Key Files Explained

### [lib/supabase/client.ts](lib/supabase/client.ts)
Creates a browser-side Supabase client for client components. Used in forms, buttons, and real-time subscriptions.

### [lib/supabase/server.ts](lib/supabase/server.ts)
Creates a server-side Supabase client with cookie handling. Used in Server Components and API routes for authentication checks.

### [components/BookmarkList.tsx](components/BookmarkList.tsx)
Core component implementing real-time subscriptions. Listens for INSERT, UPDATE, and DELETE events and updates the UI accordingly.

### [app/dashboard/page.tsx](app/dashboard/page.tsx)
Protected route that checks authentication and displays the main bookmark management interface.

### [app/api/auth/callback/route.ts](app/api/auth/callback/route.ts)
Handles the OAuth callback from Google, exchanges the code for a session, and redirects to the dashboard.

## Future Enhancements

- Add tags/categories for better organization
- Implement bookmark search and filtering
- Add bookmark import/export functionality
- Support for bookmark folders
- Browser extension for quick bookmarking
- Sharing bookmarks with other users

## License

MIT
