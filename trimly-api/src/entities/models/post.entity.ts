export interface IPostEntity {
  postId: string;
  barberId: string;
  caption: string;
  description: string;
  image: string;
  likes: string[];
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}
