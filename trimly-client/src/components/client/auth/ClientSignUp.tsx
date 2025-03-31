import { useState } from "react";
import { motion } from "framer-motion";
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberHappy from "@/assets/common/barber-happy.png";
import { UserRoles } from "@/types/UserRoles";
import { User } from "@/types/User";
import { useFormik } from "formik";
import { clientSignupSchema } from "@/utils/validations/client-signup.validator";
import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import { useToaster } from "@/hooks/ui/useToaster";
import { CredentialResponse } from "@react-oauth/google";
import { GoogleAuthButton } from "@/components/auth/GoogleAuth";
import { useSendOTPMutation } from "@/hooks/auth/useSendOtp";
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import { MuiTextField } from "@/components/common/fields/MuiTextField";
import MuiButton from "@/components/common/buttons/MuiButton";
import OTPModal from "@/components/modals/OTPModal";

interface SignUpProps {
	userType: UserRoles;
	onSubmit: (data: User) => void;
	setLogin?: () => void;
	isLoading: boolean;
	handleGoogleAuth: (credential: CredentialResponse) => void;
}

const ClientSignUp = ({
	onSubmit,
	setLogin,
	isLoading,
	handleGoogleAuth,
}: SignUpProps) => {
	const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [userData, setUserData] = useState<User>({} as User);

	const { mutate: sendVerificationOTP, isPending: isSendOtpPending } =
		useSendOTPMutation();
	const { mutate: verifyOTP, isPending: isVerifyOtpPending } =
		useVerifyOTPMutation();
		
	const { successToast, errorToast } = useToaster();

	const submitRegister = () => {
		onSubmit(userData);
	};

	const handleOpenOTPModal = () => {
		setIsOTPModalOpen(true);
	};

	const handleCloseOTPModal = () => {
		setIsSending(false);
		setIsOTPModalOpen(false);
	};

	const handleSendOTP = (email?: string) => {
		setIsSending(() => true);
		sendVerificationOTP(email ?? userData.email, {
			onSuccess(data) {
				successToast(data.message);
				setIsSending(false);
				handleOpenOTPModal();
			},
			onError(error: any) {
				errorToast(error.response.data.message);
				// handleCloseOTPModal();
			},
		});
	};

	const handleVerifyOTP = (otp: string) => {
		verifyOTP(
			{ email: userData.email, otp },
			{
				onSuccess() {
					// successToast(data.message);
					submitRegister();
					handleCloseOTPModal();
					formik.resetForm();
				},
				onError(error: any) {
					errorToast(error.response.data.message);
				},
			}
		);
	};

	const formik = useFormik({
		initialValues: {
			fullName: "",
			email: "",
			phoneNumber: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: clientSignupSchema,
		onSubmit: (values) => {
			setUserData(values);
			handleSendOTP(values.email);
		},
	});

	return (
		<>
			<PublicHeader />
			<motion.div className="min-h-screen flex flex-col md:flex-row">
				{/* Left Section with Image */}
				<div className="hidden md:flex w-1/2 bg-[var(--bg-yellow)] relative overflow-hidden justify-center items-end">
					<img
						src={BarberToolsBG || "/placeholder.svg"}
						alt="barber-tools-bg"
						className="absolute inset-0 w-full h-full object-cover brightness-90"
					/>
					<motion.img
						initial={{ scale: 1.1 }}
						animate={{ scale: 1 }}
						transition={{ duration: 2 }}
						src={BarberHappy}
						alt="Barber"
						className="relative z-10 w-[40rem] pb"
					/>
				</div>

				{/* Right Section with Form */}
				<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="max-w-md mx-auto w-full space-y-8">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold tracking-tight">
								Create your account
							</h2>
							<p className="text-muted-foreground mt-2">
								Enter your details to get started
							</p>
						</div>

						<form
							className="space-y-2"
							onSubmit={formik.handleSubmit}>
							<div className="flex flex-col gap-3.5">
								{/* First & Last Name */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<MuiTextField
										id="fullName"
										name="fullName"
										error={
											formik.touched.fullName &&
											Boolean(formik.errors.fullName)
										}
										helperText={
											formik.touched.fullName
												? formik.errors.fullName
												: ""
										}
										value={formik.values.fullName}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Full Name"
										placeholder="John Fury"
									/>
									{/* Phone */}
									<MuiTextField
										id="phoneNumber"
										name="phoneNumber"
										type="text"
										error={
											formik.touched.phoneNumber &&
											Boolean(formik.errors.phoneNumber)
										}
										helperText={
											formik.touched.phoneNumber
												? formik.errors.phoneNumber
												: ""
										}
										value={formik.values.phoneNumber}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Phone"
										placeholder="Enter your phone"
									/>
								</div>

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

								{/* Password & Confirm Password */}
								{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
								<MuiTextField
									id="password"
									name="password"
									type={"password"}
									error={
										formik.touched.password &&
										Boolean(formik.errors.password)
									}
									helperText={
										formik.touched.password
											? formik.errors.password
											: ""
									}
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Password"
									isPassword
									placeholder="Create password"
								/>
								<MuiTextField
									id="confirmPassword"
									name="confirmPassword"
									isPassword={true}
									type={"password"}
									error={
										formik.touched.confirmPassword &&
										Boolean(formik.errors.confirmPassword)
									}
									helperText={
										formik.touched.confirmPassword
											? formik.errors.confirmPassword
											: ""
									}
									value={formik.values.confirmPassword}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Confirm Password"
									placeholder="Confirm password"
								/>
								{/* </div> */}
							</div>

							{/* Terms & Conditions */}
							<div className="flex items-center justify-end space-x-2">
								<div className="flex items-center gap-1.5">
									<label
										htmlFor="terms"
										className="text-sm text-muted-foreground">
										Already have an account ?{" "}
									</label>
									<span
										onClick={setLogin}
										className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] cursor-pointer">
										Login Now!
									</span>
								</div>
							</div>

							{/* Submit Button */}
							<MuiButton
								type="submit"
								disabled={
									isLoading ||
									isSendOtpPending ||
									isVerifyOtpPending
								}
								loading={
									isLoading ||
									isSendOtpPending ||
									isVerifyOtpPending
								}
								fullWidth>
								Create Account
							</MuiButton>
							{/* Social SignUp */}
							<div className="text-center my-4 text-muted-foreground text-xs">
								OR
							</div>
							<GoogleAuthButton
								handleGoogleSuccess={handleGoogleAuth}
							/>
						</form>
					</motion.div>
				</div>
			</motion.div>
			<OTPModal
				isOpen={isOTPModalOpen}
				onClose={handleCloseOTPModal}
				onVerify={handleVerifyOTP}
				onResend={handleSendOTP}
				isSending={isSending}
			/>
		</>
	);
};
export default ClientSignUp;
