"use client";

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DoaLingkunganContent } from "./components/doa-lingkungan-content";

// Komponen Loading Sederhana
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-44" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

export default function DoaLingkunganPage() {
  return (
    <div className="p-2 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <DoaLingkunganContent />
      </Suspense>
    </div>
  )
} 