import { Suspense } from "react"
import KasLingkunganContent from "./components/kas-lingkungan-content"
import LoadingSkeleton from "./components/loading-skeleton"

export default function KasLingkunganPage() {
  return (
    <div className="p-2">
      <h1 className="text-xl font-bold md:px-2">Kas Lingkungan</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <KasLingkunganContent />
      </Suspense>
    </div>
  )
} 