# Freezer Status - Modern Inventory Tracker

A modern, real-time freezer inventory tracking app built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

✨ **Real-time sync** across all devices  
🎨 **Modern UI** with Tailwind CSS and smooth animations  
📱 **Fully responsive** design  
🔍 **Search functionality** to find items quickly  
➕ **Add, edit, delete** items with ease  
⬆️⬇️ **Increment/decrement** counts with one tap  
🌙 **Dark mode** by default  

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Create the Database Table

In your Supabase project:

1. Go to **SQL Editor**
2. Run this SQL command to create the table:

```sql
-- Create the freezer_items table
create table freezer_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table freezer_items enable row level security;

-- Create a policy that allows all operations (since there's no auth yet)
create policy "Allow all operations"
  on freezer_items
  for all
  using (true)
  with check (true);

-- Enable real-time
alter publication supabase_realtime add table freezer_items;
```

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Add items**: Fill in the name and count, then click "Add Item"
- **Edit items**: Click the pencil icon on any item to edit it
- **Delete items**: Click the trash icon to remove an item
- **Adjust counts**: Use the + and - buttons to quickly adjust quantities
- **Search**: Type in the search bar to filter items

## Deployment

### Deploy to Vercel

The easiest way to deploy:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

Don't forget to add your environment variables in the Vercel project settings!

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Hosting**: Vercel (recommended)

## Adding Authentication (Optional)

To add user authentication later:

1. Enable Email auth in Supabase: **Authentication** → **Providers** → Enable Email
2. Update the RLS policies to use `auth.uid()`
3. Add login/signup pages
4. Modify queries to filter by user ID

## Old React App

The previous version of this app has been moved to the `old-app` directory.
