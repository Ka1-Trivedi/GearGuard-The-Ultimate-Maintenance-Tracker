import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { hasAnyRole, hasPermission } from '@/lib/rbac'

/**
 * Role-based protected route component
 * Usage: <RoleProtectedRoute requiredRoles={['manager', 'operator']}>...</RoleProtectedRoute>
 */
export function RoleProtectedRoute({ children, requiredRoles, requiredPermission }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (requiredRoles && !hasAnyRole(user, requiredRoles)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You do not have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Required role{requiredRoles.length > 1 ? 's' : ''}: {requiredRoles.join(', ')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your role: {user.role}
          </p>
        </div>
      </div>
    )
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have the required permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  return children
}

