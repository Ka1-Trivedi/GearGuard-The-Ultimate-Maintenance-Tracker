import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getPreventiveRequests, getEquipmentById } from '@/lib/mock-data'
import { CreateRequestModal } from '@/components/create-request-modal'
import { useRole } from '@/hooks/useRole'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const canCreateMaintenance = hasPermission('CREATE_MAINTENANCE')
  const canViewMaintenance = hasPermission('VIEW_MAINTENANCE')

  const preventiveRequests = getPreventiveRequests()

  const events = preventiveRequests.map((request) => {
    const equipment = getEquipmentById(request.equipment_id)
    return {
      id: request.id,
      title: `${request.subject} - ${equipment?.name || 'Unknown'}`,
      start: new Date(request.scheduled_date),
      end: new Date(request.scheduled_date),
      allDay: true,
      request: request,
    }
  })

  const handleSelectSlot = ({ start }) => {
    // Only allow creating requests if user has permission
    if (!canCreateMaintenance) {
      return
    }
    setSelectedDate(start.toISOString().split('T')[0])
    setIsCreateModalOpen(true)
  }

  const handleSelectEvent = (event) => {
    // Navigate to maintenance request details if user can view maintenance
    if (canViewMaintenance && event.request) {
      navigate(`/maintenance/${event.request.id}`)
    }
  }

  const eventStyleGetter = (event) => {
    const isOverdue = new Date(event.start) < new Date() && event.request.stage !== 'Repaired'
    return {
      className: isOverdue ? 'rbc-overdue-event' : '',
      style: {
        backgroundColor: isOverdue ? '#ef4444' : '#3b82f6',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
      },
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance Calendar</h1>
            <p className="text-muted-foreground">View preventive maintenance schedules</p>
          </div>
          {canCreateMaintenance && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preventive Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '600px' }}>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable={canCreateMaintenance}
                eventPropGetter={eventStyleGetter}
                defaultView="month"
                views={['month', 'week', 'day']}
              />
            </div>
          </CardContent>
        </Card>

        {canCreateMaintenance && (
          <CreateRequestModal
            open={isCreateModalOpen}
            onOpenChange={(open) => {
              setIsCreateModalOpen(open)
              if (!open) setSelectedDate(null)
            }}
            prefillDate={selectedDate}
          />
        )}
      </div>
    </div>
  )
}

