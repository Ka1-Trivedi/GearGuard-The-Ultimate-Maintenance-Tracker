// Mock Database - Simulating relational data structure

// Teams (Maintenance Teams)
export const teams = [
  { id: 1, name: 'Mechanics', description: 'Mechanical maintenance team' },
  { id: 2, name: 'Electricians', description: 'Electrical maintenance team' },
  { id: 3, name: 'IT Support', description: 'IT equipment maintenance team' },
  { id: 4, name: 'HVAC', description: 'Heating, ventilation, and air conditioning team' },
  { id: 5, name: 'General Maintenance', description: 'General facility maintenance' },
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
    duration: null, // Will be filled when moved to "Repaired"
    stage: 'In Progress',
    priority: 'High',
    assignee: 'John Smith',
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
    created_date: '2024-01-19',
    description: 'Server rack showing overheating warnings. Temperature sensors reading above normal.',
    duration: 2.5, // Hours spent
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
    created_date: '2024-01-12',
    description: 'Monthly filter replacement for main building HVAC unit.',
  },
]

// Helper functions to get related data
export function getEquipmentById(id) {
  return equipment.find((eq) => eq.id === id)
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

// Mock Users for authentication (temporary - should be replaced with database)
const users = [
  { id: 1, email: 'admin@gearguard.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@gearguard.com', password: 'user123', name: 'Regular User', role: 'user' },
  { id: 3, email: 'tech@gearguard.com', password: 'tech123', name: 'Technician', role: 'technician' },
]

// Helper function to find user by email
export function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
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
  const hasNumber = /[0-9]/.test(password)

  const errors = []
  
  if (!hasMinLength) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!hasNumber) {
    errors.push('Password must contain at least one number')
  }
  
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: hasLowerCase && hasUpperCase && hasSpecialChar && hasMinLength && hasNumber,
    errors,
  }
}

// Helper function to create new user
export function createUser(userData) {
  const newUser = {
    id: users.length + 1,
    ...userData,
    role: 'user',
  }
  users.push(newUser)
  return newUser
}

// Mock Technicians (for Dashboard)
const technicians = [
  { id: 1, name: 'John Smith', team_id: 1, utilization: 75 },
  { id: 2, name: 'Mike Johnson', team_id: 1, utilization: 60 },
  { id: 3, name: 'Sarah Williams', team_id: 3, utilization: 80 },
  { id: 4, name: 'Tom Brown', team_id: 4, utilization: 50 },
]

// Mock Work Centers
export const workCenters = [
  { id: 1, name: 'Main Workshop', location: 'Building A' },
  { id: 2, name: 'IT Lab', location: 'Building B' },
]

// Get Technician by ID
export function getTechnicianById(id) {
  return technicians.find((tech) => tech.id === id) || null
}

// Get Critical Equipment (< 30% Health) - simplified version
export function getCriticalEquipment() {
  // Since our equipment doesn't have health, return equipment with multiple open requests
  const equipmentWithRequests = {}
  requests.forEach((req) => {
    if (req.stage !== 'Repaired' && req.stage !== 'Scrap') {
      equipmentWithRequests[req.equipment_id] = (equipmentWithRequests[req.equipment_id] || 0) + 1
    }
  })
  return equipment.filter((eq) => {
    const openRequestCount = equipmentWithRequests[eq.id] || 0
    return openRequestCount >= 2 && eq.status !== 'Scrap'
  })
}

// Get Average Technician Utilization
export function getAverageTechnicianUtilization() {
  if (technicians.length === 0) return 0
  const total = technicians.reduce((sum, tech) => sum + (tech.utilization || 0), 0)
  return Math.round(total / technicians.length)
}

// Get Technicians by Team ID
export function getTechniciansByTeamId(teamId) {
  return technicians.filter((tech) => tech.team_id === teamId)
}

// Get Work Center by ID
export function getWorkCenterById(id) {
  return workCenters.find((wc) => wc.id === id) || null
}

