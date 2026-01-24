import { Loader2 } from 'lucide-react'
import { Skeleton, Card, CardContent, CardHeader } from "@/components/ui"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-6 p-8">

      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>

      {/* Stats/Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="col-span-3">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>

    </div>
  )
}




export function Loading2() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}
