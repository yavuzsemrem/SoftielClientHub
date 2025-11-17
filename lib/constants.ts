export const COLORS = {
  primary: '#0056b8',
  secondary: '#ff9700',
  background: '#f8f9fb',
  surface: '#ffffff',
  text: '#1f1f1f',
  error: '#dc2626',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
  CANCELLED: 'cancelled',
} as const;

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision-requested',
} as const;

export const FILE_CATEGORIES = {
  DESIGN: 'design',
  DOCUMENT: 'document',
  CODE: 'code',
  OTHER: 'other',
} as const;

