import { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberHappy from "@/assets/common/barber-happy.png";
import { useToaster } from "@/hooks/ui/useToaster";
import { useSendOTPMutation } from "@/hooks/auth/useSendOtp";
import { useVerifyOTPMutation } from "@/hooks/auth/useVerifyOtp";
import { barberSignupSchema } from "@/utils/validations/barber-signup.validator";
import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import OTPModal from "../modals/OTPModal";
import MuiButton from "../common/buttons/MuiButton";
import { MuiTextField } from "../common/fields/MuiTextField";
import { barberSignupSchema } from "@/utils/validations/barber-signup.validator";

const BarberSignUp = ({ onSubmit, setLogin, isLoading }) => {
	const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [userData, setUserData] = useState(null);

	const { mutate: sendVerificationOTP } = useSendOTPMutation();
	const { mutate: verifyOTP } = useVerifyOTPMutation();
	const { successToast, errorToast } = useToaster();

	const handleSendOTP = (email: string) => {
		setIsSending(true);
		sendVerificationOTP(email, {
			onSuccess: (data) => {
				successToast(data.message);
				setIsSending(false);
				setIsOTPModalOpen(true);
			},
			onError: (error: any) => {
				errorToast(error.response.data.message);
				setIsSending(false);
			},
		});
	};

	const handleVerifyOTP = (otp) => {
		verifyOTP(
			{ email: userData.email, otp },
			{
				onSuccess: () => {
					onSubmit(userData);
					setIsOTPModalOpen(false);
					formik.resetForm();
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};

	const formik = useFormik({
		initialValues: {
			shopName: "",
			ownerName: "",
			email: "",
			phoneNumber: "",
			password: "",
			confirmPassword: "",
			location: "",
		},
		validationSchema: barberSignupSchema,
		onSubmit: (values) => {
			setUserData(values);
			handleSendOTP(values.email);
		},
	});

	return (
		<>
			<PublicHeader />
			<motion.div className="min-h-screen flex flex-col md:flex-row">
				<div className="hidden md:flex w-1/2 bg-[var(--bg-yellow)] relative overflow-hidden justify-center items-end">
					<img
						src={BarberToolsBG}
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
				<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="max-w-md mx-auto w-full space-y-8">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold tracking-tight">
								Register Your Barber Shop
							</h2>
							<p className="text-muted-foreground mt-2">
								Enter your details to get started
							</p>
						</div>
						<form
							className="space-y-2"
							onSubmit={formik.handleSubmit}>
							<MuiTextField
								id="shopName"
								name="shopName"
								label="Shop Name"
								{...formik.getFieldProps("shopName")}
								error={
									formik.touched.shopName &&
									Boolean(formik.errors.shopName)
								}
								helperText={
									formik.touched.shopName &&
									formik.errors.shopName
								}
							/>
							<MuiTextField
								id="ownerName"
								name="ownerName"
								label="Owner Name"
								{...formik.getFieldProps("ownerName")}
								error={
									formik.touched.ownerName &&
									Boolean(formik.errors.ownerName)
								}
								helperText={
									formik.touched.ownerName &&
									formik.errors.ownerName
								}
							/>
							<MuiTextField
								id="email"
								name="email"
								label="Email"
								{...formik.getFieldProps("email")}
								error={
									formik.touched.email &&
									Boolean(formik.errors.email)
								}
								helperText={
									formik.touched.email && formik.errors.email
								}
							/>
							<MuiTextField
								id="phoneNumber"
								name="phoneNumber"
								label="Phone Number"
								{...formik.getFieldProps("phoneNumber")}
								error={
									formik.touched.phoneNumber &&
									Boolean(formik.errors.phoneNumber)
								}
								helperText={
									formik.touched.phoneNumber &&
									formik.errors.phoneNumber
								}
							/>
							<MuiTextField
								id="location"
								name="location"
								label="Shop Location"
								{...formik.getFieldProps("location")}
								error={
									formik.touched.location &&
									Boolean(formik.errors.location)
								}
								helperText={
									formik.touched.location &&
									formik.errors.location
								}
							/>
							<MuiTextField
								id="password"
								name="password"
								label="Password"
								type="password"
								{...formik.getFieldProps("password")}
								error={
									formik.touched.password &&
									Boolean(formik.errors.password)
								}
								helperText={
									formik.touched.password &&
									formik.errors.password
								}
							/>
							<MuiTextField
								id="confirmPassword"
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								{...formik.getFieldProps("confirmPassword")}
								error={
									formik.touched.confirmPassword &&
									Boolean(formik.errors.confirmPassword)
								}
								helperText={
									formik.touched.confirmPassword &&
									formik.errors.confirmPassword
								}
							/>
							<MuiButton
								type="submit"
								disabled={isLoading || isSending}
								loading={isLoading || isSending}
								fullWidth>
								Register
							</MuiButton>
						</form>
					</motion.div>
				</div>
			</motion.div>
			<OTPModal
				isOpen={isOTPModalOpen}
				onClose={() => setIsOTPModalOpen(false)}
				onVerify={handleVerifyOTP}
				onResend={handleSendOTP}
				isSending={isSending}
			/>
		</>
	);
};

export default BarberSignUp;
