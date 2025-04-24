import { Suspense } from "react"
import PasswordForm from "./components/password-form"
import LoadingSkeleton from "./components/loading-skeleton"

// Halaman ini tersedia untuk semua role dengan fungsionalitas yang sama
// Pengaturan akses diimplementasikan melalui:
// - routeAccessMap di middleware.ts 
// - navMain di nav-menu.ts yang menampilkan menu untuk role yang bersangkutan

export default function GantiPasswordPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Ganti Password</h1>
      
      <div className="max-w-md mx-auto">
        <Suspense fallback={<LoadingSkeleton />}>
          <PasswordForm />
        </Suspense>
      </div>
    </div>
  )
} 