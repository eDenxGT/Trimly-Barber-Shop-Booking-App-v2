export interface IHandleFailurePaymentUseCase {
	execute(orderId: string, status: string): Promise<void>;
}
