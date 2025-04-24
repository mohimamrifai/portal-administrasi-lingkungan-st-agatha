"use client"

import { Suspense } from "react"
import WipeContent from "./components/wipe-content"
import LoadingSkeleton from "./components/loading-skeleton"

// Halaman ini tersedia khusus untuk role SuperUser
// Pengaturan akses diimplementasikan melalui:
// - routeAccessMap di middleware.ts 
// - navMain di nav-menu.ts yang menampilkan menu untuk role yang bersangkutan

export default function WipeDataPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <WipeContent />
      </Suspense>
    </div>
  )
} 