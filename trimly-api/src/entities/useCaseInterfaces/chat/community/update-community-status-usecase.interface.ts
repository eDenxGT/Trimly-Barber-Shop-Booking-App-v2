export interface IUpdateCommunityStatusUseCase {
  execute(communityId: string): Promise<void>;
}
