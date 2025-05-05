import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DoaLingkunganContent } from "./components/doa-lingkungan-content";
import { getAllDoling, getRiwayatKehadiran, getRekapitulasiBulanan, getKeluargaForSelection } from "./actions";

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

export default async function DoaLingkunganPage() {
  // Mengambil data dari server actions
  const dolingData = await getAllDoling();
  const riwayatData = await getRiwayatKehadiran();
  const rekapitulasiData = await getRekapitulasiBulanan(new Date().getFullYear());
  const keluargaData = await getKeluargaForSelection();
  
  return (
    <div className="p-2 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <DoaLingkunganContent 
          initialDoling={dolingData}
          initialRiwayat={riwayatData}
          initialRekapitulasi={rekapitulasiData}
          initialKeluarga={keluargaData}
        />
      </Suspense>
    </div>
  )
} 