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
import { Factory } from 'lucide-react'
import { workCenters } from '@/lib/mock-data'

export default function WorkCenters() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Work Centers</h1>
          <p className="text-muted-foreground">Manage production work centers and their capacities</p>
        </div>

        <Card className="dark:bg-[#1a1a1a] dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Factory className="h-5 w-5" />
              <span>Work Centers List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-800">
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Cost per Hour</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>OEE Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workCenters.map((wc) => (
                  <TableRow key={wc.id} className="dark:border-gray-800">
                    <TableCell className="font-medium">{wc.name}</TableCell>
                    <TableCell>{wc.code}</TableCell>
                    <TableCell>${wc.costPerHour.toFixed(2)}</TableCell>
                    <TableCell>{wc.capacity} units</TableCell>
                    <TableCell>{wc.oeeTarget}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

