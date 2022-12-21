export interface Post {
  id: string;
  author: {
    avatar: string;
    name: string;
  };
  category: string;
  content?: string;
  cover: string;
  publishedAt: number;
  readTime: string;
  shortDescription: string;
  title: string;
}
