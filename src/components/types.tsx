export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "done";
export type FilterStatus = "all" | "pending" | "done";

export interface Task {
  id: number;
  text: string;
  priority: Priority;
  status: TaskStatus;
}
