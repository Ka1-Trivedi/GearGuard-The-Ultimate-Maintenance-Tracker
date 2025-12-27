// Role-Based Access Control (RBAC) Utilities

export const ROLES = {
  TECHNICIAN: 'technician',
  OPERATOR: 'operator',
  MANAGER: 'manager',
}

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  [ROLES.TECHNICIAN]: 1,
  [ROLES.OPERATOR]: 2,
  [ROLES.MANAGER]: 3,
}

// Check if user has a specific role
export function hasRole(user, role) {
  if (!user || !user.role) return false
  return user.role === role
}

// Check if user has any of the specified roles
export function hasAnyRole(user, roles) {
  if (!user || !user.role) return false
  return roles.includes(user.role)
}

// Check if user has minimum role level (e.g., manager >= operator >= technician)
export function hasMinimumRole(user, minimumRole) {
  if (!user || !user.role) return false
  const userLevel = ROLE_HIERARCHY[user.role] || 0
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0
  return userLevel >= requiredLevel
}

// Permission definitions - Based on Core Permissions Matrix
export const PERMISSIONS = {
  // Equipment permissions
  VIEW_EQUIPMENT: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  VIEW_EQUIPMENT_DETAILS: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  VIEW_EQUIPMENT_CATEGORY: [ROLES.OPERATOR, ROLES.MANAGER], // Technician NOT allowed
  CREATE_EQUIPMENT: [ROLES.MANAGER], // Only Manager
  EDIT_EQUIPMENT: [ROLES.MANAGER], // Only Manager (Operator NOT allowed)
  DELETE_EQUIPMENT: [ROLES.MANAGER], // Only Manager
  CHANGE_EQUIPMENT_STATE: [ROLES.MANAGER], // Only Manager (Operator NOT allowed)
  
  // Maintenance permissions
  VIEW_MAINTENANCE: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  CREATE_MAINTENANCE: [ROLES.OPERATOR, ROLES.MANAGER], // Technician NOT allowed
  EDIT_MAINTENANCE: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  DELETE_MAINTENANCE: [ROLES.MANAGER],
  CHANGE_MAINTENANCE_STATUS: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER], // Technician limited
  CHANGE_STATUS_TO_SCRAP: [ROLES.MANAGER], // Only Manager
  ASSIGN_TECHNICIAN: [ROLES.MANAGER], // Only Manager
  EDIT_REQUEST_PRIORITY: [ROLES.MANAGER], // Only Manager
  ACCESS_WORKSHEET: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  
  // Dashboard permissions
  VIEW_DASHBOARD: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  
  // Calendar permissions
  VIEW_CALENDAR: [ROLES.TECHNICIAN, ROLES.OPERATOR, ROLES.MANAGER],
  
  // Teams permissions
  VIEW_TEAMS: [ROLES.OPERATOR, ROLES.MANAGER],
  EDIT_TEAMS: [ROLES.MANAGER],
  
  // Work Centers permissions
  VIEW_WORK_CENTERS: [ROLES.OPERATOR, ROLES.MANAGER],
  EDIT_WORK_CENTERS: [ROLES.MANAGER],
  
  // Reports and Analytics
  VIEW_REPORTS: [ROLES.MANAGER], // Only Manager
  
  // User Management
  USER_MANAGEMENT: [ROLES.MANAGER], // Only Manager
  
  // System Settings
  SYSTEM_SETTINGS: [ROLES.MANAGER], // Only Manager
}

// Check if user has a specific permission
export function hasPermission(user, permission) {
  if (!user || !user.role) return false
  const allowedRoles = PERMISSIONS[permission] || []
  return allowedRoles.includes(user.role)
}

// Get all permissions for a user
export function getUserPermissions(user) {
  if (!user || !user.role) return []
  return Object.keys(PERMISSIONS).filter(permission =>
    PERMISSIONS[permission].includes(user.role)
  )
}

