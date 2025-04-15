export interface Task {
    idTask: number;
    title: string;
    description: string;
    dueDate: string; // Use string for simplicity (ISO format)
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    project?: {
      idProjet: number;
      nomProjet: string;
    };
      dependencies?: number[]; 

      // Array of task IDs this task depends on

  }