import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ParkingSpotSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <CardHeader className="p-4 w-full">
        <Skeleton className="h-7 w-12 mx-auto" />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 p-4 pt-0 w-full">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-20" />
      </CardContent>
    </Card>
  )
}
