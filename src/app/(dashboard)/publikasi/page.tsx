import { Suspense } from "react"
import PublikasiContent from "./components/publikasi-content"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton untuk komponen
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-10 w-[180px]" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-4">
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-10 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function PublikasiPage() {
  return (
    <div className="p-2">
      <h1 className="text-xl font-bold md:px-2">Publikasi</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <PublikasiContent />
      </Suspense>
    </div>
  )
} 