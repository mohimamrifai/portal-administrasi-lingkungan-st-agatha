import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { KaleidoskopContent } from "./components/kaleidoskop-content";
import { getKaleidoskopData, getRingkasanKegiatan } from "./actions";

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

export default async function KaleidoskopPage() {
  // Tentukan rentang waktu (defaultnya tahun berjalan)
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear(), 0, 1); // 1 Januari tahun berjalan

  // Mengambil data dari server actions
  const activityData = await getKaleidoskopData(startDate, endDate);
  const summaryData = await getRingkasanKegiatan(startDate, endDate);
  
  return (
    <div className="p-2 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <KaleidoskopContent 
          activityData={activityData}
          summaryData={summaryData}
          periodRange={{
            startDate,
            endDate
          }}
        />
      </Suspense>
    </div>
  )
} 