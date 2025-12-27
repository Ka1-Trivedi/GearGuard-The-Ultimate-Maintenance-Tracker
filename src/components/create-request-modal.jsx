import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { equipment, teams, getEquipmentById } from '@/lib/mock-data'

export function CreateRequestModal({ open, onOpenChange, equipmentFilter, prefillDate }) {
  const [formData, setFormData] = useState({
    subject: '',
    equipment_id: equipmentFilter || '',
    type: 'Corrective',
    scheduled_date: prefillDate || '',
    priority: 'Medium',
    assignee: '',
    description: '',
    maintenance_team_id: '',
  })

  useEffect(() => {
    if (equipmentFilter) {
      setFormData((prev) => ({ ...prev, equipment_id: equipmentFilter }))
      const selectedEquipment = getEquipmentById(equipmentFilter)
      if (selectedEquipment) {
        setFormData((prev) => ({
          ...prev,
          maintenance_team_id: selectedEquipment.maintenance_team_id,
        }))
      }
    }
  }, [equipmentFilter])

  useEffect(() => {
    if (prefillDate) {
      setFormData((prev) => ({ ...prev, scheduled_date: prefillDate }))
    }
  }, [prefillDate])

  const handleEquipmentChange = (equipmentId) => {
    const selectedEquipment = getEquipmentById(parseInt(equipmentId))
    setFormData((prev) => ({
      ...prev,
      equipment_id: equipmentId,
      maintenance_team_id: selectedEquipment ? selectedEquipment.maintenance_team_id : '',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating request:', formData)
    setFormData({
      subject: '',
      equipment_id: equipmentFilter || '',
      type: 'Corrective',
      scheduled_date: prefillDate || '',
      priority: 'Medium',
      assignee: '',
      description: '',
      maintenance_team_id: '',
    })
    onOpenChange(false)
  }

  const selectedEquipment = formData.equipment_id
    ? getEquipmentById(parseInt(formData.equipment_id))
    : null
  const selectedTeam = formData.maintenance_team_id
    ? teams.find((t) => t.id === parseInt(formData.maintenance_team_id))
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Create New Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter request subject"
                required
              />
            </div>

            <div>
              <Label htmlFor="equipment">Equipment *</Label>
              <Select
                id="equipment"
                value={formData.equipment_id}
                onChange={(e) => handleEquipmentChange(e.target.value)}
                required
              >
                <option value="">Select Equipment</option>
                {equipment
                  .filter((eq) => eq.status !== 'Scrap')
                  .map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} - {eq.serialNumber}
                    </option>
                  ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="maintenance_team">Maintenance Team</Label>
              <Input
                id="maintenance_team"
                value={selectedTeam ? selectedTeam.name : 'Auto-filled from Equipment'}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Automatically filled based on selected equipment
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="Corrective">Corrective</option>
                  <option value="Preventive">Preventive</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="scheduled_date">Scheduled Date *</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Enter assignee name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter request description"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

