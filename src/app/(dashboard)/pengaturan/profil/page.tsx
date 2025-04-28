import { Suspense } from "react"
import { Metadata } from "next"
import ProfileContent from "./components/profile-content"
import LoadingSkeleton from "./components/loading-skeleton"

// Metadata halaman
export const metadata: Metadata = {
  title: "Profil - Portal Administrasi Lingkungan St. Agatha",
  description: "Pengaturan data Kepala Keluarga, Pasangan, dan Tanggungan"
}

// Halaman ini tersedia untuk semua role dengan fungsionalitas yang sama
// Pengaturan akses diimplementasikan melalui:
// - routeAccessMap di middleware.ts 
// - navMain di nav-menu.ts yang menampilkan menu untuk role yang bersangkutan

export default function ProfilPage() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-muted-foreground">
          Pengaturan data Kepala Keluarga, Pasangan, dan Tanggungan
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
} 