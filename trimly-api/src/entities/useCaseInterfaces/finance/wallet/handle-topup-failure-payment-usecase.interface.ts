export interface IHandleTopUpPaymentFailureUseCase {
  execute(orderId: string, status: "failed"): Promise<void>;
}
