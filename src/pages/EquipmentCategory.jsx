import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import { Search, ArrowLeft, Eye } from 'lucide-react'
import { getCategoryById, equipment, getTeamById } from '@/lib/mock-data'

export default function EquipmentCategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const [searchQuery, setSearchQuery] = useState('')
  const categoryIdNum = parseInt(categoryId)
  const category = getCategoryById(categoryIdNum)

  // Check permission - Technician NOT allowed
  if (!hasPermission('VIEW_EQUIPMENT_CATEGORY')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You do not have permission to view equipment category pages.
            </p>
            <Button onClick={() => navigate('/equipment')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Equipment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get all equipment for this category
  const categoryEquipment = equipment.filter((eq) => eq.category_id === categoryIdNum)

  // Filter by search query
  const filteredEquipment = categoryEquipment.filter((eq) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      eq.name.toLowerCase().includes(searchLower) ||
      eq.serialNumber.toLowerCase().includes(searchLower) ||
      eq.location.toLowerCase().includes(searchLower) ||
      eq.department.toLowerCase().includes(searchLower)
    )
  })

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Category not found</p>
              <div className="mt-4 text-center">
                <Button onClick={() => navigate('/equipment')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/equipment')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
          <p className="text-muted-foreground">{category.description || 'No description available'}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Equipment</CardTitle>
            <CardDescription>
              Filter equipment by name, serial number, location, or department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-[#09090b] dark:border-gray-700"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment in {category.name}</CardTitle>
            <CardDescription>
              {filteredEquipment.length} equipment item{filteredEquipment.length !== 1 ? 's' : ''} found
              {searchQuery && ` matching "${searchQuery}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEquipment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? (
                  <>
                    <p>No equipment found matching "{searchQuery}"</p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <p>No equipment found in this category</p>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Maintenance Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((eq) => {
                    const team = getTeamById(eq.maintenance_team_id)
                    return (
                      <TableRow key={eq.id}>
                        <TableCell className="font-medium">{eq.name}</TableCell>
                        <TableCell>{eq.serialNumber}</TableCell>
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
                          {eq.health !== undefined ? (
                            <Badge
                              variant={
                                eq.health < 30
                                  ? 'destructive'
                                  : eq.health < 70
                                  ? 'secondary'
                                  : 'default'
                              }
                            >
                              {eq.health}%
                            </Badge>
                          ) : (
                            'N/A'
                          )}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

