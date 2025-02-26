# Naxos - Restaurant Website

A modern restaurant website built with Next.js, featuring menu management, authentication, and role-based access control using Supabase.

## Features

- **Public Website**: Showcase menu items, location, and contact information
- **Authentication**: User login and registration with Supabase Auth
- **Role-Based Access Control**: Admin-only access to the management dashboard
- **Menu Management**: Create, read, update, and delete menu items
- **Image Upload**: Upload and manage menu item images with Cloudinary
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Image Storage**: Cloudinary
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- Supabase account
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/naxos.git
   cd naxos
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase and Cloudinary credentials

4. Set up the database:
   - Follow the instructions in `SUPABASE_SETUP.md` to set up your Supabase project
   - Run the SQL queries in `supabase/schema.sql` to create the necessary tables and policies

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication and Authorization

The application uses Supabase for authentication and implements role-based access control:

- **Public users**: Can view the website and menu items
- **Authenticated users**: Can log in and access their profile
- **Admin users**: Can access the admin dashboard and manage menu items

Admin access is controlled through user metadata in Supabase. See `SUPABASE_SETUP.md` for instructions on how to assign the admin role to a user.

## Deployment

The application can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the environment variables in Vercel
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [Cloudinary](https://cloudinary.com)
