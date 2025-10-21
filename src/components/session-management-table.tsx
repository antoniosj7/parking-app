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
import { Clock } from "lucide-react";

export default function SessionManagementTable() {
  const activeSessions = parkingSessions.filter(session => session.status === 'active');
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plaza</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Inicio</TableHead>
          <TableHead>Duración</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeSessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">{session.spotId}</TableCell>
            <TableCell>{session.user}</TableCell>
            <TableCell>{session.startTime}</TableCell>
            <TableCell>{session.duration}</TableCell>
            <TableCell>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                Activa
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" disabled={session.status !== 'active'}>
                 <Clock className="mr-2 h-4 w-4" />
                Finalizar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
