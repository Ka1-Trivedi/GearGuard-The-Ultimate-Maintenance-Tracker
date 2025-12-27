import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { isValidRole } from '@/lib/mock-data'

export function ProtectedRoute({ children, requiredRole, requiredRoles, requiredPermission }) {
  const { isAuthenticated, user } = useAuth()

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Validate user has valid role
  if (!user || !user.role || !isValidRole(user.role)) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
          <p className="text-sm text-muted-foreground mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    )
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Required roles: {requiredRoles.join(', ')}
          </p>
        </div>
      </div>
    )
  }

  // Permission-based access can be checked here if needed
  // For now, we'll rely on role checks

  return children
}

