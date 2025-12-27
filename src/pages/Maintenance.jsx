import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Navbar } from '@/components/navbar'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Calendar, User, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  requests,
  getEquipmentById,
  equipment,
} from '@/lib/mock-data'
import { CreateRequestModal } from '@/components/create-request-modal'

const STAGES = ['New', 'In Progress', 'Repaired', 'Scrap']

export default function MaintenancePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const equipmentFilter = searchParams.get('equipment')
  const [requestList, setRequestList] = useState(requests)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState(null)
  const [duration, setDuration] = useState('')

  useEffect(() => {
    if (equipmentFilter) {
      const filtered = requests.filter((req) => req.equipment_id === parseInt(equipmentFilter))
      setRequestList(filtered)
    } else {
      setRequestList(requests)
    }
  }, [equipmentFilter])

  const getRequestsByStageFiltered = (stage) => {
    return requestList.filter((req) => req.stage === stage)
  }

  const isOverdue = (scheduledDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const scheduled = new Date(scheduledDate)
    scheduled.setHours(0, 0, 0, 0)
    return scheduled < today
  }

  const canChangeStatus = hasPermission('CHANGE_MAINTENANCE_STATUS')
  const canChangeToScrap = hasPermission('CHANGE_STATUS_TO_SCRAP')

  const onDragEnd = (result) => {
    if (!canChangeStatus) {
      return // Prevent status changes if user doesn't have permission
    }

    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const requestId = parseInt(draggableId)
    const newStage = destination.droppableId

    // Prevent changing to "Scrap" if user doesn't have permission
    if (newStage === 'Scrap' && !canChangeToScrap) {
      return // Silently prevent the action
    }

    if (newStage === 'Repaired') {
      setCurrentRequestId(requestId)
      setIsDurationModalOpen(true)
      return
    }

    if (newStage === 'Scrap') {
      // Only managers can change equipment status to Scrap
      if (!canChangeToScrap) {
        return
      }
      const request = requestList.find((r) => r.id === requestId)
      if (request) {
        const eq = getEquipmentById(request.equipment_id)
        if (eq && canChangeToScrap) {
          eq.status = 'Scrap'
        }
      }
    }

    const updatedRequests = requestList.map((req) =>
      req.id === requestId ? { ...req, stage: newStage } : req
    )
    setRequestList(updatedRequests)
  }

  const handleDurationSubmit = () => {
    if (currentRequestId && duration) {
      const updatedRequests = requestList.map((req) =>
        req.id === currentRequestId
          ? { ...req, stage: 'Repaired', duration: parseFloat(duration) }
          : req
      )
      setRequestList(updatedRequests)
      setIsDurationModalOpen(false)
      setDuration('')
      setCurrentRequestId(null)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'secondary'
      case 'Low':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Kanban Board</h1>
            <p className="text-muted-foreground">Manage maintenance requests by stage</p>
          </div>
          {hasPermission('CREATE_MAINTENANCE') && (
            <Button onClick={() => navigate('/maintenance/create')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[500px] dark:bg-[#1a1a1a] dark:border-gray-800 ${
                      snapshot.isDraggingOver ? 'dark:bg-gray-800/50' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{stage}</span>
                        <Badge variant="secondary">
                          {getRequestsByStageFiltered(stage).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getRequestsByStageFiltered(stage).map((request, index) => {
                        const equipment = getEquipmentById(request.equipment_id)
                        const overdue = isOverdue(request.scheduled_date)
                        return (
                          <Draggable
                            key={request.id}
                            draggableId={request.id.toString()}
                            index={index}
                            isDragDisabled={!canChangeStatus || (stage === 'Scrap' && !canChangeToScrap)}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-move dark:bg-[#09090b] dark:border-gray-800 ${
                                  overdue ? 'border-red-500 border-2' : ''
                                } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <CardContent className="pt-4">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-semibold text-sm text-foreground">{request.subject}</h4>
                                      {overdue && (
                                        <Badge variant="destructive" className="text-xs">
                                          Overdue
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {equipment?.name || 'Unknown Equipment'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                                        {request.priority}
                                      </Badge>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <User className="h-3 w-3 mr-1" />
                                        {request.assignee}
                                      </div>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {new Date(request.scheduled_date).toLocaleDateString()}
                                    </div>
                                    {request.duration && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Wrench className="h-3 w-3 mr-1" />
                                        {request.duration}h
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <CreateRequestModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          equipmentFilter={equipmentFilter ? parseInt(equipmentFilter) : null}
        />

        <Dialog open={isDurationModalOpen} onOpenChange={setIsDurationModalOpen}>
          <DialogContent onClose={() => setIsDurationModalOpen(false)}>
            <DialogHeader>
              <DialogTitle>Enter Duration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter hours spent"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDurationModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDurationSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

