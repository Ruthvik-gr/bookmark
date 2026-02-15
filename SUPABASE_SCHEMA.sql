-- Smart Bookmark App - Database Schema
-- Run this in Supabase SQL Editor

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

-- RLS Policy: Users can view their own bookmarks
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- RLS Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- RLS Policy: Users can update their own bookmarks
create policy "Users can update own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

-- RLS Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime for the bookmarks table
alter publication supabase_realtime add table bookmarks;

-- Optional: Create an index on user_id for better query performance
create index bookmarks_user_id_idx on bookmarks(user_id);

-- Optional: Create an index on created_at for sorting
create index bookmarks_created_at_idx on bookmarks(created_at desc);
