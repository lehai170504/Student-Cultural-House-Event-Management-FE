import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailSkeleton() {
  const infoSkeletons = Array.from({ length: 3 });
  const budgetSkeletons = Array.from({ length: 3 });
  const feedbackSkeletons = Array.from({ length: 3 });

  return (
    <main className="min-h-screen bg-gray-50 pb-12 animate-in fade-in">
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-b-3xl shadow-md mb-8">
        <Skeleton className="h-10 w-32 opacity-80" />
        <Skeleton className="h-8 w-44 opacity-80" />
        <Skeleton className="h-12 w-40 opacity-80" />
      </section>

      <section className="container mx-auto px-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {infoSkeletons.map((_, idx) => (
            <Card key={`info-skeleton-${idx}`}>
              <CardHeader className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {budgetSkeletons.map((_, idx) => (
            <Card key={`budget-skeleton-${idx}`} className="text-center">
              <CardHeader>
                <Skeleton className="h-5 w-32 mx-auto" />
              </CardHeader>
              <CardContent className="flex items-center justify-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-1/3" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-24 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbackSkeletons.map((_, idx) => (
              <div
                key={`feedback-skeleton-${idx}`}
                className="border-b last:border-0 pb-4 last:pb-0"
              >
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center gap-2 mt-2">
                  {Array.from({ length: 5 }).map((__, starIdx) => (
                    <Skeleton
                      key={`star-${idx}-${starIdx}`}
                      className="h-4 w-4 rounded"
                    />
                  ))}
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


