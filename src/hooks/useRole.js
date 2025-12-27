import { useAuth } from '@/contexts/AuthContext'
import { hasRole, hasAnyRole, hasMinimumRole, hasPermission } from '@/lib/rbac'

/**
 * Custom hook for role-based access control
 * Provides convenient methods to check user roles and permissions
 */
export function useRole() {
  const { user } = useAuth()

  return {
    user,
    hasRole: (role) => hasRole(user, role),
    hasAnyRole: (roles) => hasAnyRole(user, roles),
    hasMinimumRole: (minimumRole) => hasMinimumRole(user, minimumRole),
    hasPermission: (permission) => hasPermission(user, permission),
    isTechnician: hasRole(user, 'technician'),
    isOperator: hasRole(user, 'operator'),
    isManager: hasRole(user, 'manager'),
  }
}

