export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  message: string;
  attachments?: string[]; // Firebase Storage URLs
  replyToId?: string; // For reply functionality
  createdAt: string;
  updatedAt?: string;
}

