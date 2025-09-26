# AI Prompt Management App

This app is a web app for managing and sharing AI prompts, built using [Next.js](https://nextjs.org) and [Supabase](https://supabase.com).  
It aims to make it easier for users to organize, store, and share their prompts and their results.

---

## 🚀 Feature List.

### 🔐 Authentication Function

- User registration and login
- Password reset
- Logout
- User data separation by Row Level Security (RLS) using Supabase Auth.

--- 📋 Auth.

### 📋 Prompt Management

- Create, edit, and delete prompts
- Display of prompt detail page
- Dashboard display of prompt list.

--- ###

### 🏷 Tag Management

- Create and delete tags
- Multiple tagging of prompts (many-to-many support with intermediate tables)
- Filtering prompts by tags
- Tag Cloud Display.

--- 🏷 🏷 Tag Management

### 🖼 Result Management

- Save text results
- Image Upload (using Supabase Storage)
- Delete results
- View result detail page.

--- 🔎 UI functions

### 🔎 UI Functions

- Tag refinement search on dashboard
- Prompt keyword search (optional)

--- --- 🔗 🔗 Share function

### 🔗 Sharing Features

- Public URL generation for sharing prompt results
- Supabase signed URL support (also available for private storage operations).

--- ### 🔗 🔗 Other

### ⚙️ Others

- Dynamic routing using Next.js App Router
- Authenticated page protection by Protected Layout
- Responsive support by Tailwind CSS

--- ## 💡 Other

## 💡 Points to consider

### Full-scale configuration utilizing Supabase

- Consistent use of Supabase's Auth, Database (PostgreSQL), Storage, and RLS
- Data isolation per user by RLS
- Flexible sharing functionality using service role keys and signed URLs

---Service Role Keys and Signed URLs for flexible sharing

### ✅ 2. Utilize Next.js App Router

- Development with app directory structure
- Dynamic routing (e.g. /prompt/[id])
- Appropriate use of client and server components
- Authentication control by Protected Layout

---Authentication control by Protected Layout

### ✅ 3. Relation Design

- Implement many-to-many of prompts and tags in intermediate table (prompt_tags)
- Implement 1:N relationship of prompt → result
- Implement JOIN equivalent processing in Supabase query.

---.......................

### ✅ 4. Attention to UI/UX

- Beautiful UI using Tailwind CSS
- Smartphone support (responsive)
- Easy-to-use UI with tag filtering and other practical features

---Tailwind's UI

### Free frame operation

- Free frame of Vercel can be used.
- Low cost operation by combining with Supabase's free frame.

UI --- ### ✅ 5.

## 🎯 Areas where you can make the most of

- SaaS application development
- Management screen for multi-users
- Data management apps
- Image upload / storage utilization apps
- Authentication/authorization required
