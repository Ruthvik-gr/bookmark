export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type BookmarkInsert = {
  user_id: string;
  url: string;
  title: string;
};

export type BookmarkUpdate = {
  url?: string;
  title?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark;
        Insert: BookmarkInsert;
        Update: BookmarkUpdate;
      };
    };
  };
};
