# LabTrack

A simple lab inventory and reagent management system, built with MongoDB, Express, React (Vite), and Node (MERN).

## Folder structure

```
cs project/
  server/     -> Express + Mongoose backend (API)
  client/     -> React frontend (Vite)
```

## Requirements

- Node.js installed
- MongoDB installed and running locally on port 27017

## How to run it locally

### 1. Start MongoDB

On this machine MongoDB is already installed and running as a Windows Service, so you usually don't need to do
anything. You can check it's running with:

```
powershell -Command "Get-Service -Name MongoDB"
```

If it says "Stopped", start it with:

```
powershell -Command "Start-Service -Name MongoDB"
```

(If you're on a different computer without MongoDB installed as a service, you'd instead open a terminal and run
`mongod` to start the database manually, and leave that terminal open.)

### 2. Install dependencies (only needed once)

```
cd server
npm install

cd ../client
npm install
```

### 3. Seed the database with demo data (only needed once, or whenever you want to reset the data)

```
cd server
npm run seed
```

This wipes the `users`, `chemicals`, `orders`, and `activitylogs` collections and creates 3 demo accounts
(one per role) plus 5 demo chemicals and 1 demo order request. All 3 demo accounts use the password `password123`:

| Role           | Email                  | Password    |
|----------------|-------------------------|-------------|
| Student        | student@labtrack.com    | password123 |
| Lab Manager    | manager@labtrack.com    | password123 |
| Department Head| depthead@labtrack.com   | password123 |

### 4. Start the backend server

Open a terminal:

```
cd server
npm run dev
```

This starts the API on **http://localhost:5000**. You should see "Server is running on port 5000" and
"MongoDB connected successfully!" in the terminal. Keep this terminal open.

### 5. Start the frontend

Open a **second** terminal:

```
cd client
npm run dev
```

This starts the React app on **http://localhost:3000**. Open that URL in your browser.

### 6. Log in

Use any of the 3 demo accounts above, or click "Register here" to create your own account and pick a role.

## Notes

- The backend and frontend must both be running at the same time (2 separate terminals).
- If you change your Mongoose schemas or want a clean slate, just re-run `npm run seed`.
- `server/.env` holds the Mongo connection string and JWT secret. It's a class project running locally, so these
  are not sensitive, but it's still good practice to keep `.env` out of git (already in `.gitignore`).
