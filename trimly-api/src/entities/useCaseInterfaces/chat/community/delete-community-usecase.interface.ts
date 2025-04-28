export interface IDeleteCommunityUseCase {
  execute: (communityId: string) => Promise<void>;
}
