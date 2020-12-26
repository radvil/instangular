export interface Post {
  _id: string;
  description: string;
  image: string;
  author: Author;
  thumbnail?: string;
  tags?: string[];
  totalLikes?: number;
  likedBy?: string[];
  totalComments?: number;
  commentedBy?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}