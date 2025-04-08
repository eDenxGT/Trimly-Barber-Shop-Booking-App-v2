import { Settings } from "@/components/common/components/Settings";
import { useLogout } from "@/hooks/auth/useLogout";
import { useToaster } from "@/hooks/ui/useToaster";
import { logoutClient } from "@/services/auth/authService";
import {
	clientLogout,
	refreshClientSessionThunk,
} from "@/store/slices/client.slice";
import { useAppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const ClientSettingsPage = () => {
	const { mutate: logoutReq } = useLogout(logoutClient);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { successToast, errorToast } = useToaster();

	const handleLogout = () => {
		logoutReq(undefined, {
			onSuccess: (data) => {
				dispatch(clientLogout());
				successToast(data.message);
				navigate("/");
			},
			onError: (err: any) => {
				errorToast(err.response.data.message);
			},
		});
	};
	return (
		<motion.div
			key={"client-settings"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<Settings
				userRole="client"
				profileUrl="/settings/profile"
				securityUrl="/settings/change-password"
				onLogout={handleLogout}
			/>
		</motion.div>
	);
};
