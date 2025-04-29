export interface IRazorpayService {
  createOrder(
    amount: number,
    receipt: string,
    notes?: Record<string, string>
  ): Promise<any>;
  verifySignature(data: {
    order_id: string;
    payment_id: string;
    signature: string;
  }): Promise<boolean>;
}
