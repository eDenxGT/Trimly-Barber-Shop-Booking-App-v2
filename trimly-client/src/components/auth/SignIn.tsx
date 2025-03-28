import { useFormik } from "formik";
import BarberToolsBG from "@/assets/common/barber-tools.png";
import BarberHappy from "@/assets/common/barber-pointing.png";
import { PublicHeader } from "@/components/mainComponents/PublicHeader";
import { signinSchema } from "@/utils/validations/signin.validator";
import { UserRoles } from "@/types/UserRoles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CredentialResponse } from "@react-oauth/google";
import { GoogleAuthButton } from "./GoogleAuth";
import { MuiTextField } from "../common/fields/MuiTextField";
import MuiButton from "../common/buttons/MuiButton";

interface SignInProps {
	userType: UserRoles;
	onSubmit: (data: { email: string; password: string }) => void;
	setRegister?: () => void;
	isLoading: boolean;
	handleGoogleAuth: (credential: CredentialResponse) => void;
}

const SignIn = ({
	userType,
	onSubmit,
	setRegister,
	isLoading,
	handleGoogleAuth,
}: SignInProps) => {
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: signinSchema,
		onSubmit: (values) => {
			console.log(values);
			onSubmit(values);
		},
	});

	const handleForgotPasswordRedirection = () => {
		switch (userType) {
			case "barber":
				navigate("/barber/forgot-password");
				break;
			case "admin":
				navigate("/admin/forgot-password");
				break;
			default:
				navigate("/forgot-password");
				break;
		}
	};

	return (
		<>
			<PublicHeader />
			<div className="min-h-screen flex flex-col md:flex-row">
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
						className="relative z-10 w-[45rem] pb-none"
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
								Sign in to your account
							</h2>
							<p className="text-muted-foreground mt-2">
								Enter your credentials to continue
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
									type="text"
									error={
										formik.touched.email &&
										Boolean(formik.errors.email)
									}
									helperText={
										formik.touched.email
											? formik.errors.email
											: ""
									}
									placeholder="Enter your email"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.email}
									label="Email"
									isPassword={false}
								/>

								{/* Password */}
								<MuiTextField
									id="password"
									name="password"
									type="password"
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
									placeholder="Enter password"
									isPassword={true}
								/>
							</div>

							{/* Forgot Password & Register Now */}
							<div className="flex items-center justify-between space-x-2">
								<div className="text-sm">
									<span
										onClick={
											handleForgotPasswordRedirection
										}
										className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] hover:cursor-pointer">
										Forgot password?
									</span>
								</div>
								{userType !== "admin" && (
									<div className="flex items-center gap-1.5">
										<label
											htmlFor="register"
											className="text-sm text-muted-foreground">
											Don't have an account?{" "}
										</label>
										<span
											onClick={setRegister}
											className="text-[var(--yellow)] hover:text-[var(--yellow-hover)] cursor-pointer">
											Register Now!
										</span>
									</div>
								)}
							</div>

							{/* Submit Button */}
							<MuiButton
								disabled={isLoading}
								loading={isLoading}
								type="submit"
								fullWidth
								variant="yellow">
								Sign In
							</MuiButton>

							{/* Social SignIn */}
							{userType !== "admin" && (
								<>
									<div className="text-center my-4 text-muted-foreground text-xs">
										OR
									</div>
									<GoogleAuthButton
										handleGoogleSuccess={handleGoogleAuth}
									/>
								</>
							)}
						</form>
					</motion.div>
				</div>
			</div>
		</>
	);
};

export default SignIn;
