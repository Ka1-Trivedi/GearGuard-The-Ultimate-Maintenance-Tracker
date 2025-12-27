import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { useRole } from '@/hooks/useRole'
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
import { equipment, getCategoryById, getTeamById } from '@/lib/mock-data'

export default function EquipmentPage() {
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEquipment = equipment.filter((eq) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      eq.name.toLowerCase().includes(searchLower) ||
      eq.serialNumber.toLowerCase().includes(searchLower) ||
      eq.location.toLowerCase().includes(searchLower) ||
      eq.department.toLowerCase().includes(searchLower)
    )
  })

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
                {filteredEquipment.map((eq) => {
                  const category = getCategoryById(eq.category_id)
                  const team = getTeamById(eq.maintenance_team_id)
                  return (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>{eq.serialNumber}</TableCell>
                      <TableCell>
                        {category ? (
                          hasPermission('VIEW_EQUIPMENT_CATEGORY') ? (
                            <button
                              onClick={() => navigate(`/equipment/category/${category.id}`)}
                              className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {category.name}
                            </button>
                          ) : (
                            <span>{category.name}</span>
                          )
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{eq.location}</TableCell>
                      <TableCell>{eq.department}</TableCell>
                      <TableCell>{team?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={eq.status === 'Scrap' ? 'destructive' : 'success'}
                        >
                          {eq.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link to={`/equipment/${eq.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

