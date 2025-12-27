import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { emailExists, validatePassword, createUser } from '@/lib/mock-data'

export default function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    // Check if email already exists
    if (emailExists(formData.email)) {
      setErrors({ email: 'Email id already exists in database' })
      return
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setErrors({
        password: 'Password must contain at least one lowercase, one uppercase, one special character, and be at least 8 characters long',
      })
      return
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Create new user (portal user)
      const newUser = createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: 'My company', // Default company
      })

      // Auto-login after signup
      login(newUser)
      setIsLoading(false)
      navigate('/')
    }, 500)
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-[#1a1a1a] dark:border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign up page</CardTitle>
          <CardDescription className="text-center">
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email id</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
              {errors.email && (
                <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
              {formData.password && (
                <div className="text-xs space-y-1">
                  <div className={`flex items-center space-x-2 ${passwordValidation.errors.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.errors.hasLowerCase ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>At least one lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.errors.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.errors.hasUpperCase ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>At least one uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.errors.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.errors.hasSpecialChar ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>At least one special character</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.errors.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.errors.hasMinLength ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    <span>At least 8 characters long</span>
                  </div>
                </div>
              )}
              {errors.password && (
                <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Re-Enter password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="dark:bg-[#09090b] dark:border-gray-700"
              />
              {errors.confirmPassword && (
                <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                to="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

