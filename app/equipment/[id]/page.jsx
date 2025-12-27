'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Wrench, AlertTriangle } from 'lucide-react'
import {
  getEquipmentById,
  getTeamById,
  getCategoryById,
  getOpenRequestsByEquipmentId,
} from '@/lib/api'

export default function EquipmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const equipmentId = parseInt(params.id)
  const [equipment, setEquipment] = useState(null)
  const [team, setTeam] = useState(null)
  const [category, setCategory] = useState(null)
  const [openRequests, setOpenRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [equipData, requestsData] = await Promise.all([
          getEquipmentById(equipmentId),
          getOpenRequestsByEquipmentId(equipmentId),
        ])
        
        if (equipData) {
          setEquipment(equipData)
          const [teamData, categoryData] = await Promise.all([
            equipData.maintenance_team_id ? getTeamById(equipData.maintenance_team_id) : null,
            equipData.category_id ? getCategoryById(equipData.category_id) : null,
          ])
          setTeam(teamData)
          setCategory(categoryData)
        }
        setOpenRequests(requestsData)
      } catch (error) {
        console.error('Error loading equipment details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [equipmentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading equipment details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p>Equipment not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isScrap = equipment.status === 'Scrap'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Equipment List
        </Button>

        {isScrap && (
          <Card className="mb-6 border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-semibold">This equipment has been marked as Scrap and is no longer in use.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{equipment.name}</h1>
              <p className="text-muted-foreground">Equipment Details</p>
            </div>
            <Button
              onClick={() => router.push(`/maintenance?equipment=${equipmentId}`)}
              className="flex items-center space-x-2"
              size="lg"
            >
              <Wrench className="h-5 w-5" />
              <span>Maintenance</span>
              {openRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {openRequests.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Equipment identification and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p className="text-lg">{equipment.serial_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-lg">{category?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={isScrap ? 'destructive' : 'success'} className="mt-1">
                  {equipment.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                <p className="text-lg">{equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Assignment</CardTitle>
              <CardDescription>Where the equipment is located and who manages it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg">{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-lg">{equipment.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Employee</p>
                <p className="text-lg">{equipment.assigned_employee || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance Team</p>
                <p className="text-lg">{team?.name || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Warranty Information</CardTitle>
              <CardDescription>Warranty details and expiration</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{equipment.warrantyInfo}</p>
            </CardContent>
          </Card>

          {openRequests.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Open Maintenance Requests</CardTitle>
                <CardDescription>
                  {openRequests.length} active maintenance request{openRequests.length !== 1 ? 's' : ''} for this equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {openRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{req.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {req.type} • {req.priority} Priority • {req.stage}
                        </p>
                      </div>
                      <Badge variant={req.priority === 'High' ? 'destructive' : 'secondary'}>
                        {req.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

