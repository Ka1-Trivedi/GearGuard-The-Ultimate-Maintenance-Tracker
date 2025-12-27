# Quick Start Guide

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Key Pages

- **Dashboard** (`/`): Overview with statistics and charts
- **Equipment** (`/equipment`): List all equipment, click to view details
- **Maintenance** (`/maintenance`): Kanban board for managing requests
- **Calendar** (`/calendar`): Preventive maintenance schedule

## Testing Features

### Equipment Detail Page
1. Go to `/equipment`
2. Click "View" on any equipment
3. Notice the **Maintenance** button with badge showing open request count
4. Click it to see filtered maintenance requests

### Kanban Board
1. Go to `/maintenance`
2. Drag a card from "New" to "In Progress"
3. Drag a card to "Repaired" - you'll be prompted for duration
4. Drag a card to "Scrap" - equipment status will be updated

### Calendar
1. Go to `/calendar`
2. Click any date to create a new preventive maintenance request
3. Notice overdue events are highlighted in red

### Request Creation
1. Click "Create Request" button (available on Maintenance and Calendar pages)
2. Select an Equipment - notice the Maintenance Team auto-fills
3. Fill in other details and submit

## Mock Data

All data is stored in `lib/mock-data.js`. You can modify this file to:
- Add more equipment
- Create new requests
- Add teams
- Update relationships

## Notes

- This is a mock system - data changes are not persisted
- Refresh the page to reset to original mock data
- In production, replace mock data with a real database

