export interface Attachment {
  id: string;
  type: 'file' | 'image';
  url?: string;
  name?: string;
  size?: string;
}

export interface Email {
  id: string;
  attachments?: Attachment[];
  createdAt: number;
  folder: string;
  from: {
    name: string;
    email: string;
    avatar: string | null;
  };
  isImportant: boolean;
  isStarred: boolean;
  isUnread: boolean;
  labelIds: string[];
  message: string;
  subject: string;
  to: {
    name: string;
    email: string;
    avatar: string | null;
  }[];
}

export type LabelType = 'system' | 'custom';

export interface Label {
  id: string;
  color?: string;
  name: string;
  totalCount?: number;
  type: LabelType;
  unreadCount?: number;
}
