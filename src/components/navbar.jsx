import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Wrench, LayoutDashboard, Calendar, Package, Factory, Users, Sun, Moon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  // Don't show navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password') {
    return null
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/equipment', label: 'Equipment', icon: Package },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/work-centers', label: 'Work Centers', icon: Factory },
    { href: '/teams', label: 'Teams', icon: Users },
  ]

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-gray-900 dark:text-white" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">GearGuard</h1>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className={cn(
                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                theme === 'dark' && 'text-white'
              )}
              size="icon"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            {user && (
              <Button
                variant="ghost"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                size="icon"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'flex items-center space-x-2',
                      isActive
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

