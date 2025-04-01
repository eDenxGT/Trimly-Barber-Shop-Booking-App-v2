export interface IUpdateUserStatusUseCase {
	execute(userType: string, userId: any): Promise<void>;
}
