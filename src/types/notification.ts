export interface Notification {
  id: string;
  author?: string;
  avatar?: string;
  company?: string;
  createdAt: number;
  description?: string;
  job?: string;
  title?: string;
  read?: boolean;
  type: string;
}
