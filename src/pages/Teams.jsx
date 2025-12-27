import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users } from 'lucide-react'
import { teams, technicians, getTechniciansByTeamId } from '@/lib/mock-data'

export default function Teams() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground">View maintenance teams and their technicians</p>
        </div>

        <div className="space-y-6">
          {teams.map((team) => {
            const teamTechnicians = getTechniciansByTeamId(team.id)
            return (
              <Card key={team.id} className="dark:bg-[#1a1a1a] dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{team.name}</span>
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">{team.description}</p>
                </CardHeader>
                <CardContent>
                  {teamTechnicians.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:border-gray-800">
                          <TableHead>Technician Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Utilization</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamTechnicians.map((tech) => (
                          <TableRow key={tech.id} className="dark:border-gray-800">
                            <TableCell className="font-medium">{tech.name}</TableCell>
                            <TableCell>{tech.email}</TableCell>
                            <TableCell>{tech.utilization}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No technicians assigned to this team.</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

