import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { TaskStats } from "@/components/tasks/task-stats";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { useListTasks } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  });

  const { data: tasks, isLoading } = useListTasks({
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter as any,
  });

  return (
    <div className="min-h-[100dvh] bg-background relative">
      {/* Soft background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-200/40 blur-[100px] rounded-full" />
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">My Tasks</h1>
            <p className="text-muted-foreground">Manage your workflow and stay focused.</p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
            size="lg"
            data-testid="btn-create-task"
          >
            <Plus className="w-5 h-5" /> New Task
          </Button>
        </div>

        <TaskStats />

        <div className="mt-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full md:w-auto">
              <TabsList className="bg-muted border border-border p-1 h-auto">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">All Tasks</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Pending</TabsTrigger>
                <TabsTrigger value="in_progress" className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">In Progress</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-border focus-visible:ring-primary w-full"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="bg-white border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You're all caught up! Create a new task to get started."}
              </p>
              {!(search || statusFilter !== "all") && (
                <Button variant="outline" onClick={() => setIsCreateOpen(true)} className="border-border hover:bg-muted">
                  Create your first task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
