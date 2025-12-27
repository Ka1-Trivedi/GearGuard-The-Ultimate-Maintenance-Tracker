'use client'

import { useState, useEffect } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getPreventiveRequests, getEquipmentById } from '@/lib/api'
import { CreateRequestModal } from '@/components/create-request-modal'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Use moment for react-big-calendar
const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const preventiveRequests = await getPreventiveRequests()
        
        // Load equipment for each request
        const eventsData = await Promise.all(
          preventiveRequests.map(async (request) => {
            let equipment = null
            try {
              equipment = await getEquipmentById(request.equipment_id)
            } catch (error) {
              console.error(`Error loading equipment ${request.equipment_id}:`, error)
            }
            return {
              id: request.id,
              title: `${request.subject} - ${equipment?.name || 'Unknown'}`,
              start: new Date(request.scheduled_date),
              end: new Date(request.scheduled_date),
              allDay: true,
              request: request,
            }
          })
        )
        setEvents(eventsData)
      } catch (error) {
        console.error('Error loading calendar data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start.toISOString().split('T')[0])
    setIsCreateModalOpen(true)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading calendar data...</p>
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
            <h1 className="text-3xl font-bold">Maintenance Calendar</h1>
            <p className="text-muted-foreground">View preventive maintenance schedules</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Button>
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
                selectable
                eventPropGetter={eventStyleGetter}
                defaultView="month"
                views={['month', 'week', 'day']}
              />
            </div>
          </CardContent>
        </Card>

        <CreateRequestModal
          open={isCreateModalOpen}
          onOpenChange={(open) => {
            setIsCreateModalOpen(open)
            if (!open) setSelectedDate(null)
          }}
          prefillDate={selectedDate}
        />
      </div>
    </div>
  )
}

