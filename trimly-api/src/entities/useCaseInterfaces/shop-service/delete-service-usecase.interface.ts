export interface IDeleteServiceUseCase {
	execute(serviceId: string, barberId: string): Promise<void>;
}
