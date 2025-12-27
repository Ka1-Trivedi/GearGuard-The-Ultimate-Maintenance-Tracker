# GearGuard: The Ultimate Maintenance Tracker

A comprehensive Maintenance Management System built with React and Vite, designed to track company assets and manage maintenance requests (Corrective & Preventive) with Odoo-like workflows.

## Features

- **Dashboard**: Overview with summary cards and charts showing requests per team and equipment category
- **Equipment Management**: List and detail views for all company assets with smart maintenance button
- **Maintenance Kanban Board**: Drag-and-drop workflow management with stages (New, In Progress, Repaired, Scrap)
- **Calendar View**: Visual schedule for preventive maintenance requests
- **Request Creation**: Modal form with auto-fill logic for maintenance teams based on equipment selection

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui components
- **Icons**: Lucide React
- **Kanban**: @hello-pangea/dnd (drag-and-drop)
- **Calendar**: React-Big-Calendar
- **Charts**: Recharts
- **Data**: Mock data in `src/lib/mock-data.js`

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Equipment.jsx
│   │   ├── EquipmentDetail.jsx
│   │   ├── Maintenance.jsx
│   │   └── Calendar.jsx
│   ├── components/
│   │   ├── ui/             # UI components
│   │   ├── navbar.jsx
│   │   └── create-request-modal.jsx
│   ├── lib/
│   │   ├── mock-data.js    # Mock database
│   │   └── utils.js        # Utility functions
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Key Features Explained

### Equipment Detail View
- Displays all equipment information
- **Smart Maintenance Button**: Shows count of open requests and navigates to filtered maintenance view
- Visual indication when equipment is marked as "Scrap"

### Maintenance Kanban Board
- Drag-and-drop cards between stages
- **Repaired Logic**: Prompts for duration (hours) when moving to "Repaired"
- **Scrap Logic**: Automatically updates equipment status when request is moved to "Scrap"
- **Overdue Indicator**: Red border for requests past scheduled date

### Request Creation Form
- **Auto-fill Feature**: When equipment is selected, the maintenance team is automatically filled based on the equipment's assigned team
- Supports both Corrective and Preventive maintenance types

### Calendar View
- Shows only Preventive maintenance requests
- Click on any date to create a new request with that date pre-filled
- Overdue events are highlighted in red

## Data Structure

The mock data includes:
- **Teams**: Maintenance teams (Mechanics, Electricians, IT Support, etc.)
- **Equipment**: Assets with details (ID, Name, Serial Number, Location, Maintenance Team, etc.)
- **Requests**: Maintenance requests with stages, priorities, and relationships to equipment

## Dependencies

All dependencies are set to their latest versions:
- React 18.3.1
- React Router 6.26.1
- Vite 5.4.5
- Tailwind CSS 3.4.14
- And more...

## Next Steps

To make this production-ready:
1. Replace mock data with a real database (PostgreSQL, MongoDB, etc.)
2. Add authentication and authorization
3. Implement API routes for CRUD operations
4. Add real-time updates
5. Add file uploads for attachments
6. Implement notifications for overdue requests
7. Add reporting and analytics features

## License

MIT
