'use client'

import { Link, useLocation } from 'react-router-dom'
import { Wrench, LayoutDashboard, Calendar, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/equipment', label: 'Equipment', icon: Package },
    { href: '/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
  ]

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6" />
            <h1 className="text-xl font-bold">GearGuard</h1>
          </div>
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'flex items-center space-x-2',
                      isActive && 'bg-primary text-primary-foreground'
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

