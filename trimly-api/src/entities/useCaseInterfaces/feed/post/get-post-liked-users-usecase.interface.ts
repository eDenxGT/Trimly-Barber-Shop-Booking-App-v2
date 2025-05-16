
export interface IGetPostLikedUsersUseCase {
  execute({ postId }: { postId: string }): Promise<{
    userId: string;
    fullName: string;
    avatar?: string;
  }[]>;
}
