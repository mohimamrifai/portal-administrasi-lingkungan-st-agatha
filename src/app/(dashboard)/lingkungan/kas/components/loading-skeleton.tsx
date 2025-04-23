import { Skeleton } from "@/components/ui/skeleton";


export default function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    )
}