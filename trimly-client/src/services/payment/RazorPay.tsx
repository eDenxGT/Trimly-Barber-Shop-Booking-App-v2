import { useRazorpay } from "react-razorpay";
import TrimlyLogo from "/logo.svg";
import { useRef } from "react";
import { clientAxiosInstance } from "@/api/client.axios";
import MuiButton from "@/components/common/buttons/MuiButton";
import { useToaster } from "@/hooks/ui/useToaster";
import { useNavigate } from "react-router-dom";

export interface RazorpayButtonProps {
	clientId: string;
	className?: string;
	handleSuccess: () => void;
	shopId: string;
	services: string[];
	date: Date;
	startTime: string;
	bookedTimeSlots: string[];
	duration: number;
	total: number;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
	className,
	handleSuccess,
	clientId,
	bookedTimeSlots,
	date,
	duration,
	services,
	shopId,
	startTime,
	total,
}) => {
	const { Razorpay } = useRazorpay();
	const { errorToast, successToast } = useToaster();
	const navigate = useNavigate();
	const isPaymentFailedRef = useRef(false);

	const handlePayment = async () => {
		try {
			const { data } = await clientAxiosInstance.post("/client/booking", {
				bookedTimeSlots,
				clientId,
				date,
				duration,
				services,
				shopId,
				startTime,
				total,
			});

			const options: any = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID,
				amount: data.amount,
				currency: data.currency,
				name: "Trimly",
				description: "Slot Booking Payment",
				order_id: data.id,
				image: TrimlyLogo,
				retry: {
					enabled: false,
				},
				handler: async (response: {
					razorpay_order_id: string;
					razorpay_payment_id: string;
					razorpay_signature: string;
				}) => {
					try {
						isPaymentFailedRef.current = false;
						const verificationData = {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							bookingId: data.bookingId,
						};

						const result = await clientAxiosInstance.post(
							"/client/payment",
							verificationData
						);

						if (result.data.success) {
							successToast(result.data.message);
							handleSuccess();
							navigate("/my-bookings");
						} else {
							console.error("Verification failed");
						}
					} catch (verificationError: any) {
						errorToast(verificationError.response.data.message);
						console.error(
							"Payment Verification Error:",
							verificationError
						);
					}
				},

				prefill: {
					name: "Customer Name",
					email: "customer@example.com",
					contact: "9876543210",
				},

				theme: {
					color: "#feba43",
				},

				modal: {
					ondismiss: async () => {
						if (!isPaymentFailedRef.current) {
							console.log("Payment modal closed");
						}

						isPaymentFailedRef.current = false;
					},
				},
			};

			const razorpayInstance = new Razorpay(options);

			razorpayInstance.on(
				"payment.failed",
				async (errorResponse: any) => {
					isPaymentFailedRef.current = true;

					const { description, reason } = errorResponse.error;

					const res = await clientAxiosInstance.put(
						"/client/payment",
						{
							orderId: data.id,
							status: "cancelled",
						}
					);

					if (reason === "payment_failed") {
						errorToast(
							description ||
								"Payment failed. Please try another method."
						);
					} else if (reason === "payment_authorization") {
						errorToast(
							"Your payment was declined by the bank. Try another method."
						);
					} else {
						errorToast(
							res.data.message ||
								"An unexpected error occurred during payment."
						);
					}
					navigate(`/shops/${shopId}`);
				}
			);

			razorpayInstance.open();
		} catch (error: any) {
			errorToast(error.response.data.message);
			console.error("Payment Error:", error);
		}
	};

	return (
		<MuiButton onClick={handlePayment} className={className}>
			Pay Now
		</MuiButton>
	);
};
