# ReferralHub - Implementation Notes

## Overview
The application has been completely redesigned with a new authentication-based flow for managing referral requests.

## New User Flow

### 1. Home Page
- Users land on the home page
- They can browse available email templates
- When they select a template, they are redirected to login

### 2. Authentication
- **Sign Up**: New users create an account with email and password
- **Login**: Existing users sign in
- Authentication is handled by Supabase Auth

### 3. Profile Creation
- After signup, users are prompted to complete their profile
- Users upload their resume (file upload or URL)
- Resume is automatically parsed to extract:
  - Skills
  - Projects
  - Education

### 4. Profile Editing
- Users can edit their extracted profile data
- Add/remove/edit skills, projects, and education
- Changes are saved to the database

### 5. Company & Employee Search
- Users can search for companies
- Add new companies if they don't exist
- View employees at each company
- Add new employees with details (name, position, HR status)
- Select an employee to request a referral

### 6. Referral Request Flow
- User continues through the template selection
- Provides recipient information (auto-filled if coming from company search)
- Email is generated
- Referral is saved to database with status tracking

### 7. Dashboard
- View all referral requests
- Filter by:
  - All referrals
  - By company
  - By employee
  - HR only
- Search functionality
- Track referral status (pending/sent/responded/rejected)
- Quick actions to create new referrals or find employees

### 8. Follow-up Tracking
- View all scheduled follow-ups
- See upcoming and overdue follow-ups
- Mark follow-ups as completed
- Organized by company and employee

## Database Schema

### Tables Created:
1. **profiles** - User profile information linked to auth.users
2. **skills** - User skills extracted from resume
3. **projects** - User projects with descriptions and technologies
4. **education** - User education history
5. **companies** - Companies where users want referrals
6. **employees** - Employee contacts at companies
7. **referrals** - Referral request tracking
8. **followups** - Follow-up scheduling and tracking

### Storage:
- **resumes** bucket - Stores user resume files with secure access policies

## Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authenticated access required for protected routes
- Secure file uploads with user-specific paths

## Key Technologies
- **React** with TypeScript
- **Supabase** for authentication and database
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide Icons** for UI elements

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/profile/create` - Profile creation (protected)
- `/profile/edit` - Profile editing (protected)
- `/dashboard` - Main dashboard (protected)
- `/company-search` - Company and employee search (protected)
- `/followups` - Follow-up management (protected)
- `/outreach` - Referral request flow (protected)

## Protected Routes
All routes except home, login, and signup require authentication. Users are automatically redirected to login if not authenticated.
