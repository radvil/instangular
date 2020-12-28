export interface Post {
  _id: string;
  description: string;
  image: string;
  thumbnail?: string;
  author: Author;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}