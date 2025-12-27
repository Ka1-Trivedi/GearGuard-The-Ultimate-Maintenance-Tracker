import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/navbar'
import { useRole } from '@/hooks/useRole'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertCircle, Users, FileText, Plus, Search } from 'lucide-react'
import {
  getCriticalEquipment,
  getAverageTechnicianUtilization,
  getOpenRequests,
  getOverdueRequests,
  requests,
  getEquipmentById,
  getCategoryById,
  getTechnicianById,
} from '@/lib/mock-data'

export default function Dashboard() {
  const navigate = useNavigate()
  const { hasPermission } = useRole()
  const [searchQuery, setSearchQuery] = useState('')
  const criticalEquipment = getCriticalEquipment()
  const avgUtilization = getAverageTechnicianUtilization()
  const openRequests = getOpenRequests()
  const overdueRequests = getOverdueRequests()

  // Get recent maintenance activities (last 5)
  let recentActivities = [...requests]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5)

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    recentActivities = recentActivities.filter((req) =>
      req.subject.toLowerCase().includes(query) ||
      req.created_by?.toLowerCase().includes(query) ||
      req.assignee?.toLowerCase().includes(query) ||
      req.company?.toLowerCase().includes(query)
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your maintenance operations</p>
          </div>
          {hasPermission('CREATE_MAINTENANCE') && (
            <Button
              onClick={() => navigate('/maintenance/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Q Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-[#09090b] dark:border-gray-700"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Critical Equipment Card */}
          <Card className="border-l-4 border-l-red-500 dark:bg-[#1a1a1a] border dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {criticalEquipment.length} Units &lt; 30% Health
              </div>
              <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>

          {/* Technician Load Card */}
          <Card className="border-l-4 border-l-blue-500 dark:bg-[#1a1a1a] border dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{avgUtilization}% Utilized</div>
              <p className="text-xs text-muted-foreground mt-1">Average across all technicians</p>
            </CardContent>
          </Card>

          {/* Open Requests Card */}
          <Card className="border-l-4 border-l-green-500 dark:bg-[#1a1a1a] border dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{openRequests.length} Pending</div>
              {overdueRequests.length > 0 && (
                <div className="text-sm font-semibold text-red-500 mt-1">
                  {overdueRequests.length} Overdue
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Active maintenance requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Maintenance Activities Table */}
        <Card className="dark:bg-[#1a1a1a] dark:border-gray-800">
          <CardHeader>
            <CardTitle>Recent Maintenance Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-800">
                  <TableHead>Subjects</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((req) => {
                  const equipment = getEquipmentById(req.equipment_id)
                  const category = equipment ? getCategoryById(equipment.category_id) : null
                  const technician = req.technician_id ? getTechnicianById(req.technician_id) : null
                  return (
                    <TableRow 
                      key={req.id} 
                      className="dark:border-gray-800 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/maintenance/${req.id}`)}
                    >
                      <TableCell className="font-medium">{req.subject}</TableCell>
                      <TableCell>{req.created_by || 'N/A'}</TableCell>
                      <TableCell>{technician?.name || req.assignee || 'N/A'}</TableCell>
                      <TableCell>{category?.name || 'N/A'}</TableCell>
                      <TableCell>{req.stage}</TableCell>
                      <TableCell>{req.company || 'My company'}</TableCell>
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
