# Database Setup Instructions

## Prerequisites
- Node.js installed
- PostgreSQL database connection string

## Setup Steps

1. **Create `.env` file** in the root directory:
   ```
   DATABASE_URL=postgresql://postgres:HQG6aBRowpqiqLWW@db.dugfpzbvttcqnkmuecxc.supabase.co:5432/postgres
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Initialize the database** by running:
   ```bash
   npm run init-db
   ```
   This will create all necessary tables and insert initial data.

3. **Start the development servers**:
   ```bash
   npm run dev:all
   ```
   This will start both the Vite frontend (port 5173) and the Express API server (port 3001).

   Alternatively, you can run them separately:
   ```bash
   # Terminal 1: Start API server
   npm run dev:server

   # Terminal 2: Start frontend
   npm run dev
   ```

## Database Schema

The database includes the following tables:
- `teams` - Maintenance teams
- `equipment_categories` - Equipment categories
- `equipment` - Equipment/Assets
- `maintenance_requests` - Maintenance requests

All tables are created with proper relationships and indexes for optimal performance.

## API Endpoints

The Express server provides REST API endpoints at `http://localhost:3001/api`:

- `GET /api/teams` - Get all teams
- `GET /api/equipment` - Get all equipment
- `GET /api/requests` - Get all maintenance requests
- `POST /api/requests` - Create a new maintenance request
- `PATCH /api/requests/:id` - Update a maintenance request
- And more...

See `server.js` for the complete list of endpoints.

