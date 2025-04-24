import { Suspense } from "react"
import ProfileContent from "./components/profile-content"
import LoadingSkeleton from "./components/loading-skeleton"

// Halaman ini tersedia untuk semua role dengan fungsionalitas yang sama
// Pengaturan akses diimplementasikan melalui:
// - routeAccessMap di middleware.ts 
// - navMain di nav-menu.ts yang menampilkan menu untuk role yang bersangkutan

export default function ProfilPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
} 