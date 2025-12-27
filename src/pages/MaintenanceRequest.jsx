import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, FileText, Edit, Save, X } from 'lucide-react'
import {
  equipment,
  workCenters,
  teams,
  getTechniciansByTeamId,
  getEquipmentById,
  getWorkCenterById,
  getCategoryById,
  getTeamById,
  getTechnicianById,
  getRequestById,
} from '@/lib/mock-data'

const STAGES = ['New Request', 'New', 'In Progress', 'Repaired', 'Scrap']

export default function MaintenanceRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const isViewMode = !!id && id !== 'create'
  const existingRequest = isViewMode ? getRequestById(parseInt(id)) : null

  const canEdit = hasPermission('EDIT_MAINTENANCE')
  const canCreate = hasPermission('CREATE_MAINTENANCE')
  const canEditPriority = hasPermission('EDIT_REQUEST_PRIORITY')
  const canAssignTechnician = hasPermission('ASSIGN_TECHNICIAN')
  const canChangeToScrap = hasPermission('CHANGE_STATUS_TO_SCRAP')
  const [isEditMode, setIsEditMode] = useState(false)
  const [showWorksheet, setShowWorksheet] = useState(false)
  const [worksheetComments, setWorksheetComments] = useState('')
  const [formData, setFormData] = useState({
    subject: '',
    created_by: '',
    maintenanceFor: 'equipment',
    equipment_id: '',
    work_center_id: '',
    category_id: '',
    type: 'Corrective',
    team_id: '',
    technician_id: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: '',
    priority: 'Medium',
    company: 'My company',
    request_date: '',
    description: '',
    notes: '',
    stage: 'New Request',
  })

  const [availableTechnicians, setAvailableTechnicians] = useState([])

  useEffect(() => {
    if (existingRequest) {
      const equipmentData = existingRequest.equipment_id ? getEquipmentById(existingRequest.equipment_id) : null
      const team = equipmentData ? getTeamById(equipmentData.maintenance_team_id) : null
      
      setFormData({
        subject: existingRequest.subject || '',
        created_by: existingRequest.created_by || '',
        maintenanceFor: existingRequest.work_center_id ? 'work_center' : 'equipment',
        equipment_id: existingRequest.equipment_id || '',
        work_center_id: existingRequest.work_center_id || '',
        category_id: equipmentData?.category_id || '',
        type: existingRequest.type || 'Corrective',
        team_id: team?.id || '',
        technician_id: existingRequest.technician_id || '',
        scheduled_date: existingRequest.scheduled_date || '',
        scheduled_time: existingRequest.scheduled_time || '09:00',
        duration: existingRequest.duration || '',
        priority: existingRequest.priority || 'Medium',
        company: existingRequest.company || 'My company',
        request_date: existingRequest.created_date || '',
        description: existingRequest.description || '',
        notes: existingRequest.notes || '',
        stage: existingRequest.stage || 'New Request',
      })

      if (team?.id) {
        const techs = getTechniciansByTeamId(team.id)
        setAvailableTechnicians(techs)
      }
    } else {
      // Set default request date to today
      const today = new Date().toISOString().split('T')[0]
      setFormData((prev) => ({ ...prev, request_date: today, scheduled_time: '09:00' }))
    }
  }, [existingRequest])

  useEffect(() => {
    if (formData.team_id) {
      const techs = getTechniciansByTeamId(parseInt(formData.team_id))
      setAvailableTechnicians(techs)
      if (formData.technician_id && !techs.find((t) => t.id === parseInt(formData.technician_id))) {
        setFormData((prev) => ({ ...prev, technician_id: '' }))
      }
    } else {
      setAvailableTechnicians([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.team_id])

  useEffect(() => {
    if (formData.equipment_id) {
      const equipmentData = getEquipmentById(parseInt(formData.equipment_id))
      if (equipmentData) {
        const team = getTeamById(equipmentData.maintenance_team_id)
        setFormData((prev) => ({
          ...prev,
          category_id: equipmentData.category_id,
          team_id: team?.id || '',
        }))
      }
    }
  }, [formData.equipment_id])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving request:', formData)
    // In a real app, this would make an API call
    if (isViewMode) {
      setIsEditMode(false)
    } else {
      navigate('/maintenance')
    }
  }

  const handleStageChange = (newStage) => {
    // Prevent changing to "Scrap" if user doesn't have permission
    if (newStage === 'Scrap' && !canChangeToScrap) {
      return
    }
    setFormData({ ...formData, stage: newStage })
  }

  const renderPriorityStars = () => {
    const levels = { Low: 1, Medium: 2, High: 3 }
    const level = levels[formData.priority] || 2
    const canEditPriorityNow = isEditMode && canEditPriority
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => {
              if (canEditPriorityNow) {
                const priorityMap = { 1: 'Low', 2: 'Medium', 3: 'High' }
                setFormData({ ...formData, priority: priorityMap[num] })
              }
            }}
            disabled={!canEditPriorityNow}
            className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`h-5 w-5 ${
                num <= level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const currentStageIndex = STAGES.indexOf(formData.stage)
  const equipmentData = formData.equipment_id ? getEquipmentById(parseInt(formData.equipment_id)) : null
  const category = formData.category_id ? getCategoryById(formData.category_id) : null
  const team = formData.team_id ? getTeamById(parseInt(formData.team_id)) : null
  const technician = formData.technician_id ? getTechnicianById(parseInt(formData.technician_id)) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {isViewMode && canEdit && (
            <div className="flex items-center space-x-2">
              {!isEditMode ? (
                <Button
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {isViewMode ? 'Maintenance Request Details' : 'Create Maintenance Request'}
          </h1>

          {/* Status Pipeline */}
          <div className="flex items-center space-x-2">
            {STAGES.map((stage, index) => {
              const isScrap = stage === 'Scrap'
              const canChangeToThisStage = isEditMode && (!isScrap || canChangeToScrap)
              return (
                <div key={stage} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => canChangeToThisStage && handleStageChange(stage)}
                    disabled={!canChangeToThisStage}
                    className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                      index <= currentStageIndex
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-[#1a1a1a] text-gray-400 border-gray-700'
                    } ${canChangeToThisStage ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${
                      isScrap && !canChangeToScrap ? 'opacity-50' : ''
                    }`}
                    title={isScrap && !canChangeToScrap ? 'Only managers can change status to Scrap' : ''}
                  >
                    {stage}
                  </button>
                  {index < STAGES.length - 1 && (
                    <div
                      className={`h-0.5 w-8 ${
                        index < currentStageIndex ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="dark:bg-[#1a1a1a] dark:border-gray-800">
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    {isEditMode || !isViewMode ? (
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.subject}
                      </div>
                    )}
                  </div>

                  {/* Created By */}
                  <div>
                    <Label htmlFor="created_by">Created By *</Label>
                    {isEditMode || !isViewMode ? (
                      <Input
                        id="created_by"
                        value={formData.created_by}
                        onChange={(e) => setFormData({ ...formData, created_by: e.target.value })}
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.created_by}
                      </div>
                    )}
                  </div>

                  {/* Maintenance For */}
                  <div>
                    <Label className="mb-3 block">Maintenance For *</Label>
                    {isEditMode || !isViewMode ? (
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="maintenanceFor"
                            value="equipment"
                            checked={formData.maintenanceFor === 'equipment'}
                            onChange={(e) =>
                              setFormData({ ...formData, maintenanceFor: e.target.value, work_center_id: '' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Equipment</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="maintenanceFor"
                            value="work_center"
                            checked={formData.maintenanceFor === 'work_center'}
                            onChange={(e) =>
                              setFormData({ ...formData, maintenanceFor: e.target.value, equipment_id: '' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Work Center</span>
                        </label>
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.maintenanceFor === 'equipment' ? 'Equipment' : 'Work Center'}
                      </div>
                    )}
                  </div>

                  {/* Equipment or Work Center */}
                  {formData.maintenanceFor === 'equipment' ? (
                    <>
                      <div>
                        <Label htmlFor="equipment">Equipment *</Label>
                        {isEditMode || !isViewMode ? (
                          <Select
                            id="equipment"
                            value={formData.equipment_id}
                            onChange={(e) => {
                              setFormData({ ...formData, equipment_id: e.target.value })
                            }}
                            required
                            className="dark:bg-[#09090b] dark:border-gray-700"
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
                        ) : (
                          <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                            {equipmentData ? `${equipmentData.name} (${equipmentData.serialNumber})` : 'N/A'}
                          </div>
                        )}
                      </div>

                      {/* Equipment ID / Name (Read-only when viewing) */}
                      {isViewMode && !isEditMode && equipmentData && (
                        <div>
                          <Label>Equipment ID / Name</Label>
                          <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                            {equipmentData.id} - {equipmentData.name}
                          </div>
                        </div>
                      )}

                      {/* Category (Read-only when viewing) */}
                      {isViewMode && !isEditMode && category && (
                        <div>
                          <Label>Category</Label>
                          <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                            {category.name}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="work_center">Work Center *</Label>
                      {isEditMode || !isViewMode ? (
                        <Select
                          id="work_center"
                          value={formData.work_center_id}
                          onChange={(e) => setFormData({ ...formData, work_center_id: e.target.value })}
                          required
                          className="dark:bg-[#09090b] dark:border-gray-700"
                        >
                          <option value="">Select Work Center</option>
                          {workCenters.map((wc) => (
                            <option key={wc.id} value={wc.id}>
                              {wc.name} ({wc.code})
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                          {formData.work_center_id ? getWorkCenterById(parseInt(formData.work_center_id))?.name : 'N/A'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Request Date */}
                  <div>
                    <Label htmlFor="request_date">Request Date *</Label>
                    {isEditMode || !isViewMode ? (
                      <Input
                        id="request_date"
                        type="date"
                        value={formData.request_date}
                        onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.request_date || 'N/A'}
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <Label htmlFor="type">Maintenance Type *</Label>
                    {isEditMode || !isViewMode ? (
                      <Select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      >
                        <option value="Corrective">Corrective</option>
                        <option value="Preventive">Preventive</option>
                      </Select>
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        <Badge variant={formData.type === 'Corrective' ? 'destructive' : 'default'}>
                          {formData.type}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Team */}
                  <div>
                    <Label htmlFor="team">Team *</Label>
                    {isEditMode || !isViewMode ? (
                      <Select
                        id="team"
                        value={formData.team_id}
                        onChange={(e) =>
                          setFormData({ ...formData, team_id: e.target.value, technician_id: '' })
                        }
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      >
                        <option value="">Select Team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {team?.name || 'N/A'}
                      </div>
                    )}
                  </div>

                  {/* Technician - Only managers can assign */}
                  {canAssignTechnician && (
                    <div>
                      <Label htmlFor="technician">
                        Technician {formData.team_id ? '*' : '(Select Team First)'}
                      </Label>
                      {isEditMode || !isViewMode ? (
                        <Select
                          id="technician"
                          value={formData.technician_id}
                          onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                          required={!!formData.team_id}
                          disabled={!formData.team_id}
                          className="dark:bg-[#09090b] dark:border-gray-700 disabled:opacity-50"
                        >
                          <option value="">Select Technician</option>
                          {availableTechnicians.map((tech) => (
                            <option key={tech.id} value={tech.id}>
                              {tech.name}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                          {technician?.name || 'N/A'}
                        </div>
                      )}
                    </div>
                  )}
                  {!canAssignTechnician && (
                    <div>
                      <Label>Technician</Label>
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {technician?.name || 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Only managers can assign technicians
                      </p>
                    </div>
                  )}

                  {/* Scheduled Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduled_date">Scheduled Date *</Label>
                      {isEditMode || !isViewMode ? (
                        <Input
                          id="scheduled_date"
                          type="date"
                          value={formData.scheduled_date}
                          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                          required
                          className="dark:bg-[#09090b] dark:border-gray-700"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                          {formData.scheduled_date || 'N/A'}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="scheduled_time">Scheduled Time *</Label>
                      {isEditMode || !isViewMode ? (
                        <Input
                          id="scheduled_time"
                          type="time"
                          value={formData.scheduled_time}
                          onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                          required
                          className="dark:bg-[#09090b] dark:border-gray-700"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                          {formData.scheduled_time || 'N/A'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration">Duration (hours)</Label>
                    {isEditMode || !isViewMode ? (
                      <Input
                        id="duration"
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.duration ? `${formData.duration} hours` : 'N/A'}
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <Label className="mb-2 block">Priority *</Label>
                    {renderPriorityStars()}
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    {isEditMode || !isViewMode ? (
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm">
                        {formData.company}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    {isEditMode || !isViewMode ? (
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm min-h-[80px] whitespace-pre-wrap">
                        {formData.description || 'N/A'}
                      </div>
                    )}
                  </div>

                  {/* Notes / Instructions */}
                  <div>
                    <Label htmlFor="notes">Notes / Instructions</Label>
                    {isEditMode || !isViewMode ? (
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        placeholder="Add any additional notes or instructions..."
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-background border border-input rounded-md text-sm min-h-[80px] whitespace-pre-wrap">
                        {formData.notes || 'No notes available'}
                      </div>
                    )}
                  </div>

                  {((!isViewMode && canCreate) || (isViewMode && isEditMode && canEdit)) && (
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => isViewMode ? setIsEditMode(false) : navigate(-1)}
                        className="dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {isViewMode ? 'Update Request' : 'Create Request'}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Worksheet Section */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-[#1a1a1a] dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Worksheet</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWorksheet(!showWorksheet)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {showWorksheet ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showWorksheet && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="worksheet_comments">Comments / Notes</Label>
                      <Textarea
                        id="worksheet_comments"
                        value={worksheetComments}
                        onChange={(e) => setWorksheetComments(e.target.value)}
                        rows={6}
                        placeholder="Add comments, observations, or notes about the maintenance work..."
                        className="dark:bg-[#09090b] dark:border-gray-700"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setFormData({ ...formData, notes: worksheetComments })
                        setShowWorksheet(false)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Save Comments
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
