export type ConnectionStatus =
  | 'connected'
  | 'not_connected'
  | 'pending'
  | 'rejected';

export interface Connection {
  id: string;
  avatar: string;
  commonConnections: number;
  name: string;
  status: ConnectionStatus;
}

export interface Profile {
  id: string;
  avatar: string;
  bio: string;
  connectedStatus: string;
  cover: string;
  currentCity: string;
  currentJobCompany: string;
  currentJobTitle: string;
  email: string;
  name: string;
  originCity: string;
  previousJobCompany: string;
  previousJobTitle: string;
  profileProgress: number;
  quote: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    avatar: string;
    name: string;
  };
  createdAt: number;
  message: string;
}

export interface Post {
  id: string;
  author: {
    id: string;
    avatar: string;
    name: string;
  };
  comments: Comment[];
  createdAt: number;
  isLiked: boolean;
  likes: number;
  media?: string;
  message: string;
}
