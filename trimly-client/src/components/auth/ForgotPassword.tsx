import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberThinking from "@/assets/common/barber-thinking.png";
import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import { emailSchema } from "@/utils/validations/email.validator";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPassword";
import { useToaster } from "@/hooks/ui/useToaster";
import { MuiTextField } from "../common/fields/MuiTextField";
import MuiButton from "../common/buttons/MuiButton";

interface ForgotPasswordProps {
	role: string;
	signInPath: string;
}

const ForgotPassword = ({ role, signInPath }: ForgotPasswordProps) => {
	const [emailSent, setEmailSent] = useState(false);

	const navigate = useNavigate();

	const {
		mutate: forgotPassReq,
		isPending,
		isError,
		isSuccess,
	} = useForgotPasswordMutation();
	const { successToast, errorToast } = useToaster();

	const handleForgotPasswordSubmit = ({ email }: { email: string }) => {
		forgotPassReq(
			{ email, role },
			{
				onSuccess: (data) => {
					successToast(data.message);
					setEmailSent(true);
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: emailSchema,
		onSubmit: (values) => {
			handleForgotPasswordSubmit({ ...values });
		},
	});

	return (
		<>
			<PublicHeader />
			<div className="min-h-screen flex flex-col md:flex-row">
				{/* Left Section with Image - Same as SignIn */}
				<div className="hidden md:flex w-1/2 bg-[var(--bg-yellow)] relative overflow-hidden justify-center items-end">
					<div className="absolute inset-0 pattern-bg opacity-10"></div>
					<img
						src={BarberToolsBG || "/placeholder.svg"}
						alt="barber-tools-bg"
						className="absolute inset-0 w-full h-full object-cover brightness-90"
					/>
					<motion.img
						initial={{ scale: 1.1 }}
						animate={{ scale: 1 }}
						transition={{ duration: 2 }}
						src={BarberThinking}
						alt="Barber"
						className="relative z-10 w-[30rem] pb"
					/>
				</div>

				{/* Right Section with Form */}
				<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="max-w-md mx-auto w-full space-y-8">
						{/* Go Back Link */}
						<button
							onClick={() => navigate(signInPath)}
							className="flex items-center cursor-pointer text-muted-foreground hover:text-[var(--yellow)] transition-colors">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Sign In
						</button>

						{emailSent && !isPending && !isError && isSuccess ? (
							// Success State
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center space-y-6">
								<CheckCircle className="mx-auto h-16 w-16 text-green-500" />
								<div>
									<h2 className="text-3xl font-bold tracking-tight mb-2">
										Check your email
									</h2>
									<p className="text-muted-foreground">
										We've sent a password reset link to{" "}
										<strong>{formik.values.email}</strong>
									</p>
								</div>
								<p className="text-sm text-muted-foreground">
									Didn't receive the email? Check your spam
									folder or
									<button
										type="button"
										onClick={() => setEmailSent(false)}
										className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] ml-1">
										try again
									</button>
								</p>
							</motion.div>
						) : (
							// Form State
							<>
								<div className="text-center mb-8">
									<h2 className="text-3xl font-bold tracking-tight">
										Forgot your password?
									</h2>
									<p className="text-muted-foreground mt-2">
										Enter your email and we'll send you a
										reset link
									</p>
								</div>

								<form
									className="space-y-4"
									onSubmit={formik.handleSubmit}>
									<div className="flex flex-col gap-4">
										{/* Email */}
										<MuiTextField
											id="email"
											name="email"
											type="email"
											error={
												formik.touched.email &&
												Boolean(formik.errors.email)
											}
											helperText={
												formik.touched.email
													? formik.errors.email
													: ""
											}
											value={formik.values.email}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											label="Email"
											placeholder="Enter your email"
										/>
									</div>

									{/* Submit Button */}
									<MuiButton
										disabled={isPending}
										loading={isPending}
										type="submit"
										fullWidth
										variant="yellow">
										Send Reset Link
									</MuiButton>
								</form>
							</>
						)}
					</motion.div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
