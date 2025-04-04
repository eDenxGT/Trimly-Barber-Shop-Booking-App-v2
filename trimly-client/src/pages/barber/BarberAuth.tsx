import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IBarber, ILoginData } from "@/types/User";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignIn from "@/components/auth/SignIn";
import { useToaster } from "@/hooks/ui/useToaster";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { useNavigate } from "react-router-dom";
import { useGoogleMutation } from "@/hooks/auth/useGoogle";
import { CredentialResponse } from "@react-oauth/google";
import { barberLogin } from "@/store/slices/barber.slice";
import { BarberSignUp } from "@/components/barber/auth/BarberSignUp";
import { useAppDispatch } from "@/store/store";

export const BarberAuth = () => {
	const [isLogin, setIsLogin] = useState(true);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { mutate: loginBarber, isPending: isLoginPending } =
		useLoginMutation();
	const { mutate: registerBarber, isPending } = useRegisterMutation();
	const { mutate: googleLogin } = useGoogleMutation();

	const { errorToast, successToast } = useToaster();

	const googleAuth = (credentialResponse: CredentialResponse) => {
		googleLogin(
			{
				credential: credentialResponse.credential as string,
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				role: "barber",
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(barberLogin(data.user as IBarber));
					navigate("/barber/dashboard");
				},
				onError: (error: any) =>
					errorToast(error.response.data.message),
			}
		);
	};

	const handleSignUpSubmit = (data: Omit<IBarber, "role">) => {
		registerBarber(
			{ ...data, role: "barber" },
			{
				onSuccess: (data) => successToast(data.message),
				onError: (error: any) =>
					errorToast(error.response.data.message),
			}
		);
		setIsLogin(true);
	};
	const handleLoginSubmit = (data: Omit<ILoginData, "role">) => {
		loginBarber(
			{ ...data, role: "barber" },
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(barberLogin(data.user as IBarber));
					navigate("/barber/dashboard");
				},
				onError: (error: any) => {
					errorToast(error.response.data.message);
				},
			}
		);
	};

	return (
		<>
			<AnimatePresence mode="wait">
				<motion.div
					key={isLogin ? "login" : "signup"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}>
					{isLogin ? (
						<SignIn
							isLoading={isLoginPending}
							userType="barber"
							onSubmit={handleLoginSubmit}
							setRegister={() => setIsLogin(false)}
							handleGoogleAuth={googleAuth}
						/>
					) : (
						<BarberSignUp
							isLoading={isPending}
							userType="barber"
							onSubmit={handleSignUpSubmit}
							setLogin={() => setIsLogin(true)}
							handleGoogleAuth={googleAuth}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</>
	);
};
