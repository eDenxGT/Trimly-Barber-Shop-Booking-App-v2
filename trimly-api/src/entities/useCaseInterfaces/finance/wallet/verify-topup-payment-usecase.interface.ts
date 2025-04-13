export interface IVerifyTopUpPaymentUseCase {
  execute(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    transactionId: string
  ): Promise<void>;
}
