import { useRegisterMutation } from "@/hooks/auth/useRegister";
import { IClient, ILoginData, User } from "@/types/User";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignIn from "@/components/auth/SignIn";
import { useToaster } from "@/hooks/ui/useToaster";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import { clientLogin } from "@/store/slices/client.slice";
import { useNavigate } from "react-router-dom";
import { useGoogleMutation } from "@/hooks/auth/useGoogle";
import { CredentialResponse } from "@react-oauth/google";
import ClientSignUp from "@/components/client/auth/ClientSignUp";
import { useAppDispatch } from "@/store/store";

export const ClientAuth = () => {
	const [isLogin, setIsLogin] = useState(true);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { mutate: loginClient, isPending: isLoginPending } =
		useLoginMutation();
	const { mutate: registerClient, isPending } = useRegisterMutation();
	const { mutate: googleLogin } = useGoogleMutation();

	const { errorToast, successToast } = useToaster();

	const googleAuth = (credentialResponse: CredentialResponse) => {
		googleLogin(
			{
				credential: credentialResponse.credential as string,
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				role: "client",
			},
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(clientLogin(data.user as IClient));
					navigate("/home");
				},
				onError: (error: any) =>
					errorToast(error.response.data.message),
			}
		);
	};

	const handleSignUpSubmit = (data: Omit<User, "role">) => {
		registerClient(
			{ ...data, role: "client" },
			{
				onSuccess: (data) => successToast(data.message),
				onError: (error: any) =>
					errorToast(error.response.data.message),
			}
		);
		setIsLogin(true);
	};
	const handleLoginSubmit = (data: Omit<ILoginData, "role">) => {
		loginClient(
			{ ...data, role: "client" },
			{
				onSuccess: (data) => {
					successToast(data.message);
					dispatch(clientLogin(data.user as IClient));
					navigate("/home");
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
							userType="client"
							onSubmit={handleLoginSubmit}
							setRegister={() => setIsLogin(false)}
							handleGoogleAuth={googleAuth}
						/>
					) : (
						<ClientSignUp
							isLoading={isPending}
							userType="client"
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
