import { Suspense } from "react";
import LoadingSkeleton from "./components/loading-skeleton";
import AgendaContent from "./components/agenda-content";

export default function AgendaPage() {
  return (
    <div className="p-2 px-4">
      <Suspense fallback={<LoadingSkeleton />}>
        <AgendaContent />
      </Suspense>
    </div>
  );
} 