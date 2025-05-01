import { Suspense } from "react"
import HistoriPembayaranContent from "./components/histori-pembayaran-content"
import LoadingSkeleton from "./components/loading-skeleton"

// Halaman ini dibatasi untuk role:
// 1. Umat: Dapat melihat histori pembayaran mereka sendiri
// 2. SuperUser: Dapat melihat semua histori pembayaran dari semua umat
// Pengaturan akses diimplementasikan melalui:
// - routeAccessMap di middleware.ts 
// - navMain di nav-menu.ts yang menampilkan menu untuk role yang bersangkutan

export default function HistoriPembayaranPage() {
  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <HistoriPembayaranContent />
      </Suspense>
    </div>
  )
} 