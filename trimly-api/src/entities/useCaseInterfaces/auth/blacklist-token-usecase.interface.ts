export interface IBlackListTokenUseCase {
	execute(token: string): Promise<void>;
}
