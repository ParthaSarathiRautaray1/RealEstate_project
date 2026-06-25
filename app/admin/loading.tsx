import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}</div>;
}
