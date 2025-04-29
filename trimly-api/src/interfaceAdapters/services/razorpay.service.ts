import Razorpay from "razorpay";
import { injectable } from "tsyringe";
import { config } from "../../shared/config.js";
import crypto from "crypto";
import { IRazorpayService } from "../../entities/servicesInterfaces/razorpay-service.interface.js";

@injectable()
export class RazorpayService implements IRazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.payment.RAZORPAY_KEY_ID!,
      key_secret: config.payment.RAZORPAY_SECRET!,
    });
  }

  async createOrder(
    amount: number,
    receipt: string,
    notes?: Record<string, string>
  ) {
    return this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${receipt.slice(7, 25)}`,
      notes,
    });
  }

  async verifySignature({
    order_id,
    payment_id,
    signature,
  }: {
    order_id: string;
    payment_id: string;
    signature: string;
  }): Promise<boolean> {
    const generatedSignature = crypto
      .createHmac("sha256", config.payment.RAZORPAY_SECRET!)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    return generatedSignature === signature;
  }
}
