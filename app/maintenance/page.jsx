'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Calendar, User, Wrench } from 'lucide-react'
import {
  getRequests,
  getEquipmentById,
  updateMaintenanceRequest,
  updateEquipmentStatus,
} from '@/lib/api'
import { CreateRequestModal } from '@/components/create-request-modal'

const STAGES = ['New', 'In Progress', 'Repaired', 'Scrap']

export default function MaintenancePage() {
  const searchParams = useSearchParams()
  const equipmentFilter = searchParams.get('equipment')
  const [requestList, setRequestList] = useState([])
  const [equipmentMap, setEquipmentMap] = useState({})
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState(null)
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const requests = await getRequests(equipmentFilter)
      setRequestList(requests)
      
      // Load equipment data for all requests
      const equipmentIds = [...new Set(requests.map(r => r.equipment_id))]
      const equipmentData = {}
      for (const id of equipmentIds) {
        try {
          const eq = await getEquipmentById(id)
          if (eq) equipmentData[id] = eq
        } catch (error) {
          console.error(`Error loading equipment ${id}:`, error)
        }
      }
      setEquipmentMap(equipmentData)
    } catch (error) {
      console.error('Error loading maintenance requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
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

  const onDragEnd = async (result) => {
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

    // If moving to "Repaired", prompt for duration
    if (newStage === 'Repaired') {
      setCurrentRequestId(requestId)
      setIsDurationModalOpen(true)
      return
    }

    // If moving to "Scrap", update equipment status
    if (newStage === 'Scrap') {
      const request = requestList.find((r) => r.id === requestId)
      if (request && request.equipment_id) {
        try {
          await updateEquipmentStatus(request.equipment_id, 'Scrap')
        } catch (error) {
          console.error('Error updating equipment status:', error)
        }
      }
    }

    // Update request stage
    try {
      await updateMaintenanceRequest(requestId, { stage: newStage })
      const updatedRequests = requestList.map((req) =>
        req.id === requestId ? { ...req, stage: newStage } : req
      )
      setRequestList(updatedRequests)
    } catch (error) {
      console.error('Error updating request:', error)
    }
  }

  const handleDurationSubmit = async () => {
    if (currentRequestId && duration) {
      try {
        await updateMaintenanceRequest(currentRequestId, {
          stage: 'Repaired',
          duration: parseFloat(duration),
        })
        const updatedRequests = requestList.map((req) =>
          req.id === currentRequestId
            ? { ...req, stage: 'Repaired', duration: parseFloat(duration) }
            : req
        )
        setRequestList(updatedRequests)
        setIsDurationModalOpen(false)
        setDuration('')
        setCurrentRequestId(null)
      } catch (error) {
        console.error('Error updating request duration:', error)
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading maintenance requests...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Kanban Board</h1>
            <p className="text-muted-foreground">Manage maintenance requests by stage</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[500px] ${
                      snapshot.isDraggingOver ? 'bg-muted/50' : ''
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
                        const equipment = equipmentMap[request.equipment_id]
                        const overdue = isOverdue(request.scheduled_date)
                        return (
                          <Draggable
                            key={request.id}
                            draggableId={request.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-move ${
                                  overdue ? 'border-destructive border-2' : ''
                                } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <CardContent className="pt-4">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <h4 className="font-semibold text-sm">{request.subject}</h4>
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
          onOpenChange={(open) => {
            setIsCreateModalOpen(open)
            if (!open) {
              // Reload data when modal closes
              loadData()
            }
          }}
          equipmentFilter={equipmentFilter ? parseInt(equipmentFilter) : null}
          onRequestCreated={loadData}
        />

        <Dialog open={isDurationModalOpen} onOpenChange={setIsDurationModalOpen}>
          <DialogContent>
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

