import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface OTPModalProps {
	isOpen: boolean;
	onClose: () => void;
	onVerify: (otp: string) => void;
	onResend: () => void;
	isSending: boolean;
}

export default function OTPModal({
	isOpen,
	onClose,
	onVerify,
	onResend,
	isSending,
}: OTPModalProps) {
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [timer, setTimer] = useState(30);
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isTimerRunning && timer > 0) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		} else if (timer === 0) {
			setIsTimerRunning(false);
		}
		return () => clearInterval(interval);
	}, [isTimerRunning, timer]);

	useEffect(() => {
		if (isOpen) {
			setTimer(30);
			setIsTimerRunning(true);
		}
	}, [isOpen]);

	const handleVerify = () => {
		setIsVerifying(true);
		onVerify(otp);
		setTimeout(() => {
			setIsVerifying(false);
		}, 500);
	};

	const handleResend = () => {
		onResend();
		setTimer(30);
		setIsTimerRunning(true);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md z-50 bg-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						Verification Code
					</DialogTitle>
					<DialogDescription className="text-center">
						We have sent a verification code to your email. Please
						enter the code below.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center gap-6 py-4">
					<InputOTP maxLength={4} value={otp} onChange={setOtp}>
						<InputOTPGroup className="gap-2">
							{[...Array(4)].map((_, index) => (
								<InputOTPSlot
									key={index}
									index={index}
									className="w-11 h-11 text-center text-xl bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
								/>
							))}
						</InputOTPGroup>
					</InputOTP>

					<div className="text-sm text-center">
						Didn't receive the code?{" "}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										onClick={handleResend}
										disabled={isSending || isTimerRunning}
										className="text-[#F9A826] cursor-pointer font-medium disabled:opacity-50">
										{isSending ? "Sending..." : "Resend"}
									</button>
								</TooltipTrigger>
								<TooltipContent
									className="bg-gray-400 data-[side=top]:before:hidden data-[side=bottom]:before:hidden data-[side=left]:before:hidden data-[side=right]:before:hidden"
									side="bottom">
									{isTimerRunning
										? `Resend in ${timer}s`
										: "Click to resend"}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<Button
						onClick={handleVerify}
						disabled={otp.length !== 4 || isVerifying}
						className="w-full bg-[var(--yellow)] hover:bg-[var(--yellow-hover)] text-white font-medium">
						{isVerifying ? "Verifying..." : "Verify"}
					</Button>
				</div>
			</DialogContent>

			{/* Dark overlay behind the modal */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40"
					aria-hidden="true"
				/>
			)}
		</Dialog>
	);
}
