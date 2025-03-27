import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BarberToolsBG from "@/assets/common/barber-tools.png";

export function UnauthorizedPage() {
	const navigate = useNavigate();
	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* Left Section with Image */}
			<div className="hidden md:flex w-1/2 bg-[var(--bg-yellow)] relative overflow-hidden justify-center items-end">
				<div className="absolute inset-0 pattern-bg opacity-10"></div>
				<img
					src={BarberToolsBG}
					alt="background"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<motion.div
					initial={{ scale: 1.1 }}
					animate={{ scale: 1 }}
					transition={{ duration: 2 }}
					className="relative z-10 w-full flex justify-center items-center h-full">
					<ShieldAlert className="w-64 h-64 text-white/80" />
				</motion.div>
			</div>

			{/* Right Section with Content */}
			<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="max-w-md mx-auto w-full space-y-8">
					<div className="text-center mb-8">
						<ShieldAlert className="w-16 h-16 mx-auto mb-4 text-[var(--yellow)] md:hidden" />
						<h2 className="text-3xl font-bold tracking-tight">
							401 - Unauthorized
						</h2>
						<p className="text-muted-foreground mt-2">
							You don't have permission to access this page
						</p>
					</div>

					<div className="space-y-6">
						<p className="text-center">
							Please sign in with an account that has the
							necessary permissions, or contact your administrator
							for assistance.
						</p>

						<div className="flex flex-col gap-4">
							<Button
								variant="outline"
								onClick={() => navigate("/", { replace: true })}
								className="border-[var(--yellow)] text-[var(--yellow)] hover:text-[var(--yellow-hover)] hover:border-[var(--yellow-hover)]">
								<span className="flex items-center gap-2">
									<ArrowLeft className="h-4 w-4" />
									Return to Back
								</span>
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
