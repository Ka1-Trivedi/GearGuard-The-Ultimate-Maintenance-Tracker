'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Eye } from 'lucide-react'
import { getEquipment, getCategoryById, getTeamById } from '@/lib/api'

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [equipment, setEquipment] = useState([])
  const [categories, setCategories] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [equipData, categoriesData, teamsData] = await Promise.all([
          getEquipment(),
          getEquipmentCategories(),
          getTeams(),
        ])
        setEquipment(equipData)
        setCategories(categoriesData)
        setTeams(teamsData)
      } catch (error) {
        console.error('Error loading equipment data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEquipment = equipment.filter((eq) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      eq.name.toLowerCase().includes(searchLower) ||
      eq.serial_number?.toLowerCase().includes(searchLower) ||
      eq.location?.toLowerCase().includes(searchLower) ||
      eq.department?.toLowerCase().includes(searchLower)
    )
  })

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || 'N/A'
  }

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId)
    return team?.name || 'N/A'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading equipment data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipment Management</h1>
            <p className="text-muted-foreground">View and manage all company assets</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Equipment</CardTitle>
            <CardDescription>Filter equipment by name, serial number, location, or department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment List</CardTitle>
            <CardDescription>
              {filteredEquipment.length} equipment item{filteredEquipment.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Maintenance Team</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium">{eq.name}</TableCell>
                    <TableCell>{eq.serial_number || 'N/A'}</TableCell>
                    <TableCell>{getCategoryName(eq.category_id)}</TableCell>
                    <TableCell>{eq.location || 'N/A'}</TableCell>
                    <TableCell>{eq.department || 'N/A'}</TableCell>
                    <TableCell>{getTeamName(eq.maintenance_team_id)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={eq.status === 'Scrap' ? 'destructive' : 'success'}
                      >
                        {eq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/equipment/${eq.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

