import { useState } from "react";
import { Task, TaskStatus } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Circle, Clock, Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDeleteTask, useUpdateTask, getListTasksQueryKey, getGetTaskStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TaskDialog } from "./task-dialog";

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
  pending: { label: "Pending", icon: Circle, color: "text-slate-500", bg: "bg-slate-100 border-slate-200 text-slate-600" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 border-amber-200 text-amber-700" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
};

export function TaskCard({ task }: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const StatusIcon = statusConfig[task.status].icon;

  const handleStatusToggle = () => {
    const newStatus: TaskStatus = task.status === "completed" ? "pending" : "completed";
    updateTask.mutate(
      { id: task.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTaskStatsQueryKey() });
          toast.success(`Task marked as ${newStatus.replace("_", " ")}`);
        },
        onError: () => toast.error("Failed to update task status"),
      }
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(
      { id: task.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTaskStatsQueryKey() });
          toast.success("Task deleted successfully");
          setIsDeleteDialogOpen(false);
        },
        onError: () => toast.error("Failed to delete task"),
      }
    );
  };

  return (
    <>
      <Card className={`bg-white border border-border shadow-sm group overflow-hidden transition-all hover:shadow-md ${task.status === "completed" ? "opacity-60" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <button
              onClick={handleStatusToggle}
              className={`mt-1 flex-shrink-0 transition-colors ${task.status === "completed" ? "text-emerald-500" : "text-muted-foreground hover:text-primary"}`}
              data-testid={`btn-toggle-status-${task.id}`}
            >
              <StatusIcon className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`font-medium text-lg leading-tight mb-1 ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-border shadow-lg">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer focus:bg-muted">
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={`font-normal text-xs ${statusConfig[task.status].bg}`}>
                  {statusConfig[task.status].label}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(task.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-border shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted hover:bg-secondary border-border text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
