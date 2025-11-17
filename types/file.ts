export interface File {
  id: string;
  projectId: string;
  fileName: string;
  url: string;
  category: 'design' | 'document' | 'code' | 'other';
  version: number;
  size?: number; // in bytes
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

