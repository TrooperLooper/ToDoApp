export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "done";

export interface Task {
  id: number;
  text: string;
  priority: Priority;
  status: Status;
}
