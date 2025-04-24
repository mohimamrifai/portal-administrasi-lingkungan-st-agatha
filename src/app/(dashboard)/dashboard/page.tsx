import { Suspense } from "react"
import DashboardContent from "./components/dashboard-content"
import LoadingSkeleton from "./components/loading-skeleton"

export default function DashboardPage() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold md:px-2 mb-6">Dashboard</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}