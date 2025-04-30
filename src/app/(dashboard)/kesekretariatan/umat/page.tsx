import { Suspense } from "react";
import LoadingSkeleton from "./components/loading-skeleton";
import DataUmatContent from "./components/data-umat-content";

export default function DataUmatPage() {
  return (
    <div className="p-2 md:p-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <DataUmatContent />
      </Suspense>
    </div>
  )
} 