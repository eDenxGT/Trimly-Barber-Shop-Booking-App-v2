export interface ISendEmailUseCase {
	execute(to: string, subject: string, content: string): Promise<void>;
}
