# Anime Explorer

A React JS app to explore anime shows using the [Kitsu API](https://kitsu.docs.apiary.io/) with search, trending anime shows, and pagination. This application uses Supabase to track search counts for the trending anime shows algorithm.

## Demo

![Screenshot](public/anime-explorer.png)

---

## Features

- Search anime shows by title
- Track trending searches (powered by Supabase)
- Pagination with Previous / Next buttons
- Styled using Tailwind CSS

---

## Tech Stack

- React JS (Vite)
- Supabase
- Tailwind CSS
- Kitsu API (Anime data)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/anime-explorer.git
cd anime-explorer
```

### 2. Install dependencies

npm install

### 3. Setup Supabase

1. Create a Supabase project: https://supabase.com/
2. Create a table called `searches` with the following columns:

Column       | Type    | Notes
------------ | ------- | ------------------
id           | bigint  | Primary Key, auto
searchTerm   | text    | Required
count        | int     | Default 1
animeId      | int     | Optional
posterImage  | text    | Optional

3. Go to Project Settings -> API -> anon key and copy your Supabase URL.

### 4. Configure Environment Variables

Create a `.env.local` file in the root of your project:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Replace `your_supabase_url` and `your_supabase_anon_key` with the values from your Supabase project.

### 5. Run the app

npm run dev

## Usage

- Type a search term in the search bar and press enter.
- Scroll or use Next / Previous buttons to paginate through results.
- Trending anime will be displayed above the search results.
- Supabase tracks the count of each search term.
