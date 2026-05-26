import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Task, TaskInputStatus, useCreateTask, useUpdateTask, getListTasksQueryKey, getGetTaskStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = !!task;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title || "",
        description: task?.description || "",
        status: (task?.status as any) || "pending",
      });
    }
  }, [open, task, form]);

  const onSubmit = (data: TaskFormValues) => {
    if (isEditing && task) {
      updateTask.mutate(
        { id: task.id, data: { ...data, status: data.status as any } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetTaskStatsQueryKey() });
            toast.success("Task updated");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update task"),
        }
      );
    } else {
      createTask.mutate(
        { data: { ...data, status: data.status as TaskInputStatus } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetTaskStatsQueryKey() });
            toast.success("Task created");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to create task"),
        }
      );
    }
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Review Q3 metrics" className="bg-white/5 border-white/10 focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add more details..." 
                      className="resize-none bg-white/5 border-white/10 focus-visible:ring-primary min-h-[100px]" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="glass-panel border-white/10">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-white/5 hover:bg-white/10 border-white/10">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="glow-primary hover:glow-primary-hover">
                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
