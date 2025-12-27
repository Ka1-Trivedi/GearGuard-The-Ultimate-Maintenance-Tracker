import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserByEmail, createOrUpdateUser, isValidRole, VALID_ROLES } from '@/lib/mock-data'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '', // Role selection for new users
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      let user = getUserByEmail(formData.email)

      // If user doesn't exist, check if we have role for new user creation
      if (!user) {
        if (!formData.role || !isValidRole(formData.role)) {
          setError('Please select a valid role to create a new account')
          setIsLoading(false)
          setIsNewUser(true)
          return
        }
        
        // Create new user with selected role
        user = createOrUpdateUser({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.email.split('@')[0], // Default name from email
        })
      } else {
        // Existing user - validate password
        if (user.password !== formData.password) {
          setError('Invalid Password')
          setIsLoading(false)
          return
        }

        // Update user's last login timestamp
        user.updated_at = new Date().toISOString()
        createOrUpdateUser(user)
      }

      // Validate user has valid role
      if (!user.role || !isValidRole(user.role)) {
        setError('User account has an invalid role. Please contact administrator.')
        setIsLoading(false)
        return
      }

      // Login successful
      try {
        login(user)
        setIsLoading(false)
        navigate('/')
      } catch (err) {
        setError(err.message || 'Login failed')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-[#1a1a1a] dark:border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login Page</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email id</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  // Check if user exists when email is entered
                  const existingUser = getUserByEmail(e.target.value)
                  setIsNewUser(!existingUser && e.target.value.length > 0)
                }}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  // Check if user exists when password is entered
                  const existingUser = getUserByEmail(formData.email)
                  setIsNewUser(!existingUser && formData.email.length > 0)
                }}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
            </div>

            {/* Show role selection for new users */}
            {(isNewUser || !getUserByEmail(formData.email)) && formData.email.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="role">Role * (Required for new accounts)</Label>
                <Select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required={isNewUser}
                  className="dark:bg-[#09090b] dark:border-gray-700"
                >
                  <option value="">Select Role</option>
                  {VALID_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">
                  New accounts require a role selection. Existing users will use their assigned role.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Password?
              </Link>
              <Link
                to="/signup"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

