import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react'
import {
  getEquipmentById,
  getTeamById,
  getCategoryById,
  getOpenRequestsByEquipmentId,
} from '@/lib/mock-data'

export default function EquipmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const equipmentId = parseInt(id)
  const equipment = getEquipmentById(equipmentId)
  const team = equipment ? getTeamById(equipment.maintenance_team_id) : null
  const category = equipment ? getCategoryById(equipment.category_id) : null
  const openRequests = equipment ? getOpenRequestsByEquipmentId(equipmentId) : []

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
          onClick={() => navigate(-1)}
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
              <h1 className="text-3xl font-bold text-foreground">{equipment.name}</h1>
              <p className="text-muted-foreground">Equipment Details</p>
            </div>
            {hasPermission('VIEW_MAINTENANCE') && (
              <Button
                onClick={() => navigate(`/maintenance?equipment=${equipmentId}`)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <FileText className="h-5 w-5" />
                <span>Maintenance</span>
                {openRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {openRequests.length}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        <Card className="dark:bg-[#1a1a1a] dark:border-gray-800">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Equipment identification and details</CardDescription>
          </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p className="text-lg text-foreground">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-lg text-foreground">{category?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={isScrap ? 'destructive' : 'success'} className="mt-1">
                  {equipment.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                <p className="text-lg text-foreground">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
              </div>
              {equipment.health !== undefined && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health</p>
                  <p className="text-lg text-foreground">{equipment.health}%</p>
                </div>
              )}
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
                <p className="text-lg text-foreground">{equipment.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-lg text-foreground">{equipment.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Used By</p>
                <p className="text-lg text-foreground">{equipment.assignedEmployee}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance Team</p>
                <p className="text-lg text-foreground">{team?.name || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Warranty Information</CardTitle>
              <CardDescription>Warranty details and expiration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{equipment.warrantyInfo}</p>
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
                      className="flex items-center justify-between p-3 border dark:border-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{req.subject}</p>
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

