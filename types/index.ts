export type { Project, Phase, Task, Update } from './project';
export type { Message } from './message';
export type { File } from './file';
export type { User, ClientUser } from './user';

export interface Approval {
  id: string;
  projectId: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision-requested';
  notes?: string;
  requestedAt: string;
  respondedAt?: string;
  requestedBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'update' | 'approval' | 'message' | 'task' | 'file';
  relatedId?: string; // ID of related project, task, etc.
  read: boolean;
  createdAt: string;
}

