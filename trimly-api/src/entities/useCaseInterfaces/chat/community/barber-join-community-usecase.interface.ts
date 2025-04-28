export interface IBarberJoinCommunityUseCase {
  execute({
    communityId,
    userId,
  }: {
    communityId: string;
    userId: string;
  }): Promise<void>;
}
