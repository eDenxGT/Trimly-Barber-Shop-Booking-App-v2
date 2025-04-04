import { Settings } from "@/components/common/components/Settings";
import { useLogout } from "@/hooks/auth/useLogout";
import { useToaster } from "@/hooks/ui/useToaster";
import { logoutBarber } from "@/services/auth/authService";
import { barberLogout } from "@/store/slices/barber.slice";
import { useAppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const BarberSettingsPage = () => {
	const { mutate: logoutReq } = useLogout(logoutBarber);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { successToast, errorToast } = useToaster();

	const handleLogout = () => {
		logoutReq(undefined, {
			onSuccess: (data) => {
				dispatch(barberLogout());
				successToast(data.message);
				navigate("/barber");
			},
			onError: (err: any) => {
				errorToast(err.response.data.message);
			},
		});
	};
	return (
		<motion.div
			key={"barber-settings"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<Settings
				userRole="barber"
				profileUrl="/barber/settings/profile"
				securityUrl="/barber/settings/change-password"
				onLogout={handleLogout}
			/>
		</motion.div>
	);
};
