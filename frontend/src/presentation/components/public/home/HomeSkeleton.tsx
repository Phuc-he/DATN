// src/presentation/components/public/home/HomeSkeleton.tsx

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const HomeSkeleton = () => {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Banner Skeleton */}
      <div className="w-full h-[500px] bg-slate-100 animate-pulse flex items-center px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <section className="container mx-auto px-8">
        <div className="flex justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-8 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <section className="container mx-auto px-8">
        <Skeleton className="h-8 w-64 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};