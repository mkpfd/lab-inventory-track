# LabTrack

LabTrack is a full-stack lab inventory and reagent management system. It helps students, lab managers, department heads, and admins track chemicals, submit and review requests, manage users, and review activity logs.

## Project Structure

- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend

## Requirements

- Node.js installed
- MongoDB available locally or through a cloud connection string

## Setup

1. Install dependencies in both apps:

   ```bash
   cd server
   npm install

   cd ../client
   npm install
   ```

2. Create a `server/.env` file with your backend settings:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

## How To Run

Run the backend first, then the frontend:

```bash
cd server
npm run dev
```

In a second terminal:

```bash
cd client
npm run dev
```

The client talks to the backend at `http://localhost:5000/api`.

## Seed Demo Data

The server includes a seed script that clears existing data and loads demo users, chemicals, orders, and activity logs.

```bash
cd server
npm run seed
```

## Demo Accounts

After seeding, you can log in with these accounts:

- Student: `student@labtrack.com` / `password123`
- Lab Manager: `manager@labtrack.com` / `password123`
- Dept Head: `depthead@labtrack.com` / `password123`
- Admin: `admin@system.com` / `admin123`

## Notes

- The server automatically ensures the default admin account exists.
- The frontend is built with Vite and React.
- The backend uses Express, MongoDB, JWT auth, and role-based access control.