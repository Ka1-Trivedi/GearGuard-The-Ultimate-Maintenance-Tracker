// Mock Database - Simulating relational data structure

// Users (Portal Users)
// Valid roles: 'technician', 'operator', 'manager'
export const users = [
  {
    id: 1,
    name: 'Admin Admin',
    email: 'admin@company.com',
    password: 'Admin@123', // In real app, this would be hashed
    role: 'manager',
    company: 'My company',
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'User@123',
    role: 'operator',
    company: 'My company',
    created_at: new Date('2024-01-02').toISOString(),
    updated_at: new Date('2024-01-02').toISOString(),
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    password: 'User@456',
    role: 'technician',
    company: 'My company',
    created_at: new Date('2024-01-03').toISOString(),
    updated_at: new Date('2024-01-03').toISOString(),
  },
  {
    id: 4,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    password: 'Tech@123',
    role: 'technician',
    company: 'My company',
    created_at: new Date('2024-01-04').toISOString(),
    updated_at: new Date('2024-01-04').toISOString(),
  },
  // Users created from assigned employees in equipment
  {
    id: 5,
    name: 'John Smith',
    email: 'john.smith@company.com',
    password: 'Employee@123',
    role: 'operator', // Default role for assigned employees
    company: 'My company',
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString(),
  },
  {
    id: 6,
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    password: 'Employee@123',
    role: 'operator',
    company: 'My company',
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString(),
  },
  {
    id: 7,
    name: 'Tom Brown',
    email: 'tom.brown@company.com',
    password: 'Employee@123',
    role: 'operator',
    company: 'My company',
    created_at: new Date('2024-01-05').toISOString(),
    updated_at: new Date('2024-01-05').toISOString(),
  },
]

// Helper function to find user by email
export function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

// Helper function to check if email exists
export function emailExists(email) {
  return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
}

// Helper function to validate password strength
export function validatePassword(password) {
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasMinLength = password.length >= 8

  return {
    isValid: hasLowerCase && hasUpperCase && hasSpecialChar && hasMinLength,
    errors: {
      hasLowerCase,
      hasUpperCase,
      hasSpecialChar,
      hasMinLength,
    },
  }
}

// Valid roles for role-based authentication
export const VALID_ROLES = ['technician', 'operator', 'manager']

// Helper function to validate role
export function isValidRole(role) {
  return VALID_ROLES.includes(role)
}

// Helper function to create or update user
export function createOrUpdateUser(userData) {
  const existingUser = getUserByEmail(userData.email)
  const now = new Date().toISOString()
  
  if (existingUser) {
    // Update existing user
    existingUser.name = userData.name || existingUser.name
    existingUser.email = userData.email
    existingUser.password = userData.password || existingUser.password
    existingUser.role = userData.role || existingUser.role
    existingUser.company = userData.company || existingUser.company
    existingUser.updated_at = now
    return existingUser
  } else {
    // Create new user
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password || '',
      role: userData.role || 'operator', // Default role
      company: userData.company || 'My company',
      created_at: now,
      updated_at: now,
    }
    users.push(newUser)
    return newUser
  }
}

// Helper function to create new user (for signup)
export function createUser(userData) {
  const now = new Date().toISOString()
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'operator', // Default role for new signups
    company: userData.company || 'My company',
    created_at: now,
    updated_at: now,
  }
  users.push(newUser)
  return newUser
}

// Teams (Maintenance Teams)
export const teams = [
  { id: 1, name: 'Mechanics', description: 'Mechanical maintenance team' },
  { id: 2, name: 'Electricians', description: 'Electrical maintenance team' },
  { id: 3, name: 'IT Support', description: 'IT equipment maintenance team' },
  { id: 4, name: 'HVAC', description: 'Heating, ventilation, and air conditioning team' },
  { id: 5, name: 'General Maintenance', description: 'General facility maintenance' },
]

// Technicians (linked to Teams)
export const technicians = [
  { id: 1, name: 'John Smith', team_id: 1, email: 'john.smith@company.com', utilization: 85 },
  { id: 2, name: 'Mike Johnson', team_id: 1, email: 'mike.johnson@company.com', utilization: 78 },
  { id: 3, name: 'Sarah Williams', team_id: 3, email: 'sarah.williams@company.com', utilization: 92 },
  { id: 4, name: 'Tom Brown', team_id: 4, email: 'tom.brown@company.com', utilization: 65 },
  { id: 5, name: 'Alice Davis', team_id: 2, email: 'alice.davis@company.com', utilization: 88 },
  { id: 6, name: 'Bob Wilson', team_id: 1, email: 'bob.wilson@company.com', utilization: 75 },
  { id: 7, name: 'Carol Martinez', team_id: 3, email: 'carol.martinez@company.com', utilization: 80 },
  { id: 8, name: 'David Lee', team_id: 5, email: 'david.lee@company.com', utilization: 70 },
]

// Work Centers
export const workCenters = [
  { id: 1, name: 'Assembly Line A', code: 'ASM-A', costPerHour: 45.50, capacity: 8, oeeTarget: 85 },
  { id: 2, name: 'Drill Station', code: 'DRL-01', costPerHour: 38.00, capacity: 4, oeeTarget: 80 },
  { id: 3, name: 'Welding Bay', code: 'WLD-BAY', costPerHour: 52.75, capacity: 6, oeeTarget: 75 },
  { id: 4, name: 'Quality Control', code: 'QC-01', costPerHour: 42.25, capacity: 5, oeeTarget: 90 },
  { id: 5, name: 'Packaging Line', code: 'PKG-LN', costPerHour: 35.00, capacity: 10, oeeTarget: 88 },
]

// Equipment Categories
export const equipmentCategories = [
  { id: 1, name: 'Machinery', description: 'Production machinery and equipment' },
  { id: 2, name: 'Vehicles', description: 'Company vehicles and transportation' },
  { id: 3, name: 'IT Equipment', description: 'Computers, servers, and IT infrastructure' },
  { id: 4, name: 'HVAC Systems', description: 'Heating and cooling systems' },
  { id: 5, name: 'Tools', description: 'Hand tools and power tools' },
]

// Equipment/Assets
export const equipment = [
  {
    id: 1,
    name: 'CNC Milling Machine #1',
    serialNumber: 'CNC-2023-001',
    purchaseDate: '2023-01-15',
    warrantyInfo: '2 years warranty, expires 2025-01-15',
    location: 'Production Floor A',
    department: 'Manufacturing',
    assignedEmployee: 'John Smith',
    maintenance_team_id: 1,
    category_id: 1,
    status: 'Active',
    health: 25, // Health percentage (< 30% = Critical)
  },
  {
    id: 2,
    name: 'Forklift Truck #3',
    serialNumber: 'FL-2022-003',
    purchaseDate: '2022-06-20',
    warrantyInfo: '3 years warranty, expires 2025-06-20',
    location: 'Warehouse',
    department: 'Logistics',
    assignedEmployee: 'Mike Johnson',
    maintenance_team_id: 1,
    category_id: 2,
    status: 'Active',
    health: 65,
  },
  {
    id: 3,
    name: 'Server Rack Unit A',
    serialNumber: 'SRV-2023-101',
    purchaseDate: '2023-03-10',
    warrantyInfo: '5 years warranty, expires 2028-03-10',
    location: 'Server Room',
    department: 'IT',
    assignedEmployee: 'Sarah Williams',
    maintenance_team_id: 3,
    category_id: 3,
    status: 'Active',
    health: 85,
  },
  {
    id: 4,
    name: 'HVAC Unit - Main Building',
    serialNumber: 'HVAC-2021-050',
    purchaseDate: '2021-08-05',
    warrantyInfo: 'Warranty expired',
    location: 'Main Building - Roof',
    department: 'Facilities',
    assignedEmployee: 'Tom Brown',
    maintenance_team_id: 4,
    category_id: 4,
    status: 'Active',
    health: 28,
  },
  {
    id: 5,
    name: 'Drill Press Station 2',
    serialNumber: 'DP-2020-002',
    purchaseDate: '2020-11-12',
    warrantyInfo: 'Warranty expired',
    location: 'Workshop B',
    department: 'Manufacturing',
    assignedEmployee: 'John Smith',
    maintenance_team_id: 1,
    category_id: 5,
    status: 'Scrap',
    health: 0,
  },
  {
    id: 6,
    name: 'Delivery Van #2',
    serialNumber: 'VAN-2022-002',
    purchaseDate: '2022-04-18',
    warrantyInfo: '3 years warranty, expires 2025-04-18',
    location: 'Parking Lot',
    department: 'Logistics',
    assignedEmployee: 'Mike Johnson',
    maintenance_team_id: 1,
    category_id: 2,
    status: 'Active',
    health: 72,
  },
  {
    id: 7,
    name: 'Network Switch - Floor 2',
    serialNumber: 'NSW-2023-201',
    purchaseDate: '2023-05-22',
    warrantyInfo: '3 years warranty, expires 2026-05-22',
    location: 'IT Closet - Floor 2',
    department: 'IT',
    assignedEmployee: 'Sarah Williams',
    maintenance_team_id: 3,
    category_id: 3,
    status: 'Active',
    health: 90,
  },
  {
    id: 8,
    name: 'Air Compressor Unit',
    serialNumber: 'AC-2021-015',
    purchaseDate: '2021-09-30',
    warrantyInfo: 'Warranty expired',
    location: 'Workshop A',
    department: 'Manufacturing',
    assignedEmployee: 'John Smith',
    maintenance_team_id: 1,
    category_id: 1,
    status: 'Active',
    health: 25, // Health percentage (< 30% = Critical)
  },
]

// Maintenance Requests
export const requests = [
  {
    id: 1,
    subject: 'CNC Machine - Unusual Noise',
    type: 'Corrective',
    equipment_id: 1,
    scheduled_date: '2024-01-20',
    duration: null,
    stage: 'In Progress',
    priority: 'High',
    assignee: 'John Smith',
    created_by: 'Admin Admin',
    technician_id: 1,
    company: 'My company',
    created_date: '2024-01-18',
    description: 'CNC milling machine making unusual grinding noise during operation. Needs immediate inspection.',
  },
  {
    id: 2,
    subject: 'Forklift - Monthly Inspection',
    type: 'Preventive',
    equipment_id: 2,
    scheduled_date: '2024-01-25',
    duration: null,
    stage: 'New',
    priority: 'Medium',
    assignee: 'Mike Johnson',
    created_by: 'Admin Admin',
    technician_id: 2,
    company: 'My company',
    created_date: '2024-01-15',
    description: 'Monthly preventive maintenance check for forklift truck #3. Check hydraulic system, brakes, and battery.',
  },
  {
    id: 3,
    subject: 'Server Rack - Overheating Alert',
    type: 'Corrective',
    equipment_id: 3,
    scheduled_date: '2024-01-19',
    duration: null,
    stage: 'Repaired',
    priority: 'High',
    assignee: 'Sarah Williams',
    created_by: 'Admin Admin',
    technician_id: 3,
    company: 'My company',
    created_date: '2024-01-19',
    description: 'Server rack showing overheating warnings. Temperature sensors reading above normal.',
    duration: 2.5,
  },
  {
    id: 4,
    subject: 'HVAC - Quarterly Service',
    type: 'Preventive',
    equipment_id: 4,
    scheduled_date: '2024-02-01',
    duration: null,
    stage: 'New',
    priority: 'Low',
    assignee: 'Tom Brown',
    created_by: 'Admin Admin',
    technician_id: 4,
    company: 'My company',
    created_date: '2024-01-10',
    description: 'Quarterly preventive maintenance: filter replacement, coil cleaning, and system check.',
  },
  {
    id: 5,
    subject: 'Drill Press - Motor Failure',
    type: 'Corrective',
    equipment_id: 5,
    scheduled_date: '2024-01-10',
    duration: null,
    stage: 'Scrap',
    priority: 'High',
    assignee: 'John Smith',
    created_by: 'Admin Admin',
    technician_id: 1,
    company: 'My company',
    created_date: '2024-01-08',
    description: 'Drill press motor completely failed. Repair cost exceeds replacement value. Equipment marked for scrap.',
  },
  {
    id: 6,
    subject: 'Delivery Van - Oil Change',
    type: 'Preventive',
    equipment_id: 6,
    scheduled_date: '2024-01-22',
    duration: null,
    stage: 'In Progress',
    priority: 'Medium',
    assignee: 'Mike Johnson',
    created_by: 'Admin Admin',
    technician_id: 2,
    company: 'My company',
    created_date: '2024-01-20',
    description: 'Scheduled oil change and tire rotation for delivery van #2.',
  },
  {
    id: 7,
    subject: 'Network Switch - Port Malfunction',
    type: 'Corrective',
    equipment_id: 7,
    scheduled_date: '2024-01-21',
    duration: null,
    stage: 'New',
    priority: 'High',
    assignee: 'Sarah Williams',
    created_by: 'Admin Admin',
    technician_id: 3,
    company: 'My company',
    created_date: '2024-01-21',
    description: 'Port 8 on network switch not responding. Multiple devices unable to connect.',
  },
  {
    id: 8,
    subject: 'Air Compressor - Pressure Drop',
    type: 'Corrective',
    equipment_id: 8,
    scheduled_date: '2024-01-18',
    duration: null,
    stage: 'Repaired',
    priority: 'Medium',
    assignee: 'John Smith',
    created_by: 'Admin Admin',
    technician_id: 1,
    company: 'My company',
    created_date: '2024-01-17',
    description: 'Air compressor not maintaining pressure. Suspected leak in the system.',
    duration: 3.0,
  },
  {
    id: 9,
    subject: 'CNC Machine - Weekly Calibration',
    type: 'Preventive',
    equipment_id: 1,
    scheduled_date: '2024-01-28',
    duration: null,
    stage: 'New',
    priority: 'Low',
    assignee: 'John Smith',
    created_by: 'Admin Admin',
    technician_id: 1,
    company: 'My company',
    created_date: '2024-01-15',
    description: 'Weekly calibration check for CNC milling machine to ensure precision.',
  },
  {
    id: 10,
    subject: 'HVAC - Filter Replacement',
    type: 'Preventive',
    equipment_id: 4,
    scheduled_date: '2024-01-30',
    duration: null,
    stage: 'New',
    priority: 'Low',
    assignee: 'Tom Brown',
    created_by: 'Admin Admin',
    technician_id: 4,
    company: 'My company',
    created_date: '2024-01-12',
    description: 'Monthly filter replacement for main building HVAC unit.',
  },
  {
    id: 11,
    subject: 'Test website',
    type: 'Corrective',
    equipment_id: 1,
    scheduled_date: '2024-01-25',
    duration: null,
    stage: 'New Request',
    priority: 'Medium',
    assignee: 'Mr. Fisher',
    created_by: 'Admin Admin',
    technician_id: 1,
    company: 'My company',
    created_date: '2024-01-24',
    description: 'Test maintenance request for website functionality.',
  },
]

// Helper functions to get related data
export function getEquipmentById(id) {
  return equipment.find((eq) => eq.id === id)
}

export function getRequestById(id) {
  return requests.find((req) => req.id === id)
}

export function getTeamById(id) {
  return teams.find((team) => team.id === id)
}

export function getCategoryById(id) {
  return equipmentCategories.find((cat) => cat.id === id)
}

export function getRequestsByEquipmentId(equipmentId) {
  return requests.filter((req) => req.equipment_id === equipmentId)
}

export function getOpenRequestsByEquipmentId(equipmentId) {
  return requests.filter(
    (req) => req.equipment_id === equipmentId && req.stage !== 'Repaired' && req.stage !== 'Scrap'
  )
}

export function getRequestsByStage(stage) {
  return requests.filter((req) => req.stage === stage)
}

export function getPreventiveRequests() {
  return requests.filter((req) => req.type === 'Preventive')
}

export function getOverdueRequests() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return requests.filter((req) => {
    if (req.stage === 'Repaired' || req.stage === 'Scrap') return false
    const scheduledDate = new Date(req.scheduled_date)
    scheduledDate.setHours(0, 0, 0, 0)
    return scheduledDate < today
  })
}

export function getTotalAssets() {
  return equipment.filter((eq) => eq.status !== 'Scrap').length
}

export function getOpenRequests() {
  return requests.filter((req) => req.stage !== 'Repaired' && req.stage !== 'Scrap')
}

// Get requests grouped by team
export function getRequestsByTeam() {
  const teamRequests = {}
  requests.forEach((req) => {
    const equipment = getEquipmentById(req.equipment_id)
    if (equipment) {
      const team = getTeamById(equipment.maintenance_team_id)
      if (team) {
        if (!teamRequests[team.name]) {
          teamRequests[team.name] = 0
        }
        teamRequests[team.name]++
      }
    }
  })
  return teamRequests
}

// Get requests grouped by equipment category
export function getRequestsByCategory() {
  const categoryRequests = {}
  requests.forEach((req) => {
    const equipment = getEquipmentById(req.equipment_id)
    if (equipment) {
      const category = getCategoryById(equipment.category_id)
      if (category) {
        if (!categoryRequests[category.name]) {
          categoryRequests[category.name] = 0
        }
        categoryRequests[category.name]++
      }
    }
  })
  return categoryRequests
}

// Get Technicians by Team ID
export function getTechniciansByTeamId(teamId) {
  return technicians.filter((tech) => tech.team_id === teamId)
}

// Get Technician by ID
export function getTechnicianById(id) {
  return technicians.find((tech) => tech.id === id)
}

// Get Work Center by ID
export function getWorkCenterById(id) {
  return workCenters.find((wc) => wc.id === id)
}

// Get Critical Equipment (< 30% Health)
export function getCriticalEquipment() {
  return equipment.filter((eq) => eq.health !== undefined && eq.health < 30 && eq.status !== 'Scrap')
}

// Get Average Technician Utilization
export function getAverageTechnicianUtilization() {
  if (technicians.length === 0) return 0
  const total = technicians.reduce((sum, tech) => sum + tech.utilization, 0)
  return Math.round(total / technicians.length)
}

