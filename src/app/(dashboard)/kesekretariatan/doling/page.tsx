"use client";

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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

// Komponen Content Placeholder
function DoaLingkunganContent() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doa Lingkungan</h2>
      </div>
      
      <div className="p-4 border rounded-lg">
        <p>Halaman sedang dalam pemeliharaan untuk memperbaiki tampilan dan responsivitas.</p>
        <p className="mt-2">Silahkan coba kembali beberapa saat lagi.</p>
      </div>
    </div>
  )
}

export default function DoaLingkunganPage() {
  return (
    <div className="p-2">
      <Suspense fallback={<LoadingSkeleton />}>
        <DoaLingkunganContent />
      </Suspense>
    </div>
  )
} 