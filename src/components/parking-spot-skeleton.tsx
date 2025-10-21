import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Car, Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export default function ParkingSpotSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center text-center border-dashed">
      <CardHeader className="p-4 w-full">
        <Skeleton className="h-7 w-12 mx-auto" />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-4 pt-0 w-full">
        <div className="relative">
          <Car className="h-8 w-8 text-muted-foreground/50" />
          <Loader2 className="absolute -top-1 -right-1 h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Conectando...</p>
      </CardContent>
    </Card>
  )
}
