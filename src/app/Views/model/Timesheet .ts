export interface Timesheet {
  date: string;
  hoursWorked: number;
  description: string;
  taskId: number; // Matches Task model's idTask
  projectId: number; // Matches Project model's idProjet
}