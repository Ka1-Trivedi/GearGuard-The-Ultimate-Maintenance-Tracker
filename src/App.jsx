import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Equipment from './pages/Equipment'
import EquipmentDetail from './pages/EquipmentDetail'
import EquipmentCategory from './pages/EquipmentCategory'
import Maintenance from './pages/Maintenance'
import MaintenanceRequest from './pages/MaintenanceRequest'
import Calendar from './pages/Calendar'
import WorkCenters from './pages/WorkCenters'
import Teams from './pages/Teams'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleProtectedRoute } from './components/RoleProtectedRoute'
import { PERMISSIONS } from './lib/rbac'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <Equipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment/category/:categoryId"
        element={
          <RoleProtectedRoute requiredPermission="VIEW_EQUIPMENT_CATEGORY">
            <EquipmentCategory />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/equipment/:id"
        element={
          <ProtectedRoute>
            <EquipmentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance/create"
        element={
          <RoleProtectedRoute requiredPermission="CREATE_MAINTENANCE">
            <MaintenanceRequest />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/maintenance/:id"
        element={
          <ProtectedRoute>
            <MaintenanceRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/work-centers"
        element={
          <RoleProtectedRoute requiredPermission="VIEW_WORK_CENTERS">
            <WorkCenters />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <RoleProtectedRoute requiredPermission="VIEW_TEAMS">
            <Teams />
          </RoleProtectedRoute>
        }
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

