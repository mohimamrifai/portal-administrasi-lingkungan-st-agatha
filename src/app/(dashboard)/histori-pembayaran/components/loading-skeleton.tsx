import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-2">
      {/* Skeleton Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-white dark:bg-muted flex flex-col gap-2">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="p-4 rounded-lg border bg-white dark:bg-muted flex flex-col gap-2">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
      {/* Skeleton Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Skeleton className="h-9 w-32" /> {/* Year Filter */}
          <Skeleton className="h-9 w-64" /> {/* Search */}
        </div>
        <Skeleton className="h-9 w-28" /> {/* Print PDF Button */}
      </div>
      {/* Skeleton Table */}
      <div className="rounded-md border mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2"><Skeleton className="h-5 w-32" /></th>
                <th className="px-4 py-2"><Skeleton className="h-5 w-32" /></th>
                <th className="px-4 py-2"><Skeleton className="h-5 w-24" /></th>
                <th className="px-4 py-2"><Skeleton className="h-5 w-20" /></th>
                <th className="px-4 py-2"><Skeleton className="h-5 w-16" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2"><Skeleton className="h-5 w-32 my-2" /></td>
                  <td className="px-4 py-2"><Skeleton className="h-5 w-32 my-2" /></td>
                  <td className="px-4 py-2"><Skeleton className="h-5 w-24 my-2" /></td>
                  <td className="px-4 py-2"><Skeleton className="h-5 w-20 my-2" /></td>
                  <td className="px-4 py-2"><Skeleton className="h-8 w-16 my-2 rounded" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 