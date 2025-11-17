export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number; // 0-100
  dueDate: string; // ISO date string
  lastUpdate: string; // ISO date string
  createdAt: string;
  description?: string;
}

export interface Phase {
  id: string;
  projectId: string;
  title: string;
  percent: number; // 0-100
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface Task {
  id: string;
  phaseId: string;
  projectId: string;
  title: string;
  description?: string;
  percent: number; // 0-100
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  id: string;
  projectId: string;
  title: string;
  body: string;
  progressChange?: number;
  createdAt: string;
  createdBy: string;
}

