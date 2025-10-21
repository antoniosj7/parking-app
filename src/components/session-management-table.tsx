import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { parkingSessions } from "@/lib/data"

export default function SessionManagementTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session ID</TableHead>
          <TableHead>Spot ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parkingSessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">{session.id}</TableCell>
            <TableCell>{session.spotId}</TableCell>
            <TableCell>{session.user}</TableCell>
            <TableCell>{session.startTime}</TableCell>
            <TableCell>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" disabled={session.status !== 'active'}>
                End Session
              </Button>
               <Button variant="ghost" size="sm">
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
