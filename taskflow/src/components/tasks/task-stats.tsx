import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTaskStats } from "@workspace/api-client-react";
import { CheckCircle2, Circle, Clock, LayoutList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskStats() {
  const { data: stats, isLoading } = useGetTaskStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px] bg-muted" />
              <Skeleton className="h-4 w-4 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Tasks",
      value: stats?.total || 0,
      icon: LayoutList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Circle,
      color: "text-slate-500",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <Card key={index} className="bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
