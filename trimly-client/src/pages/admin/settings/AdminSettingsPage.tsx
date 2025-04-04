import { Settings } from "@/components/common/components/Settings";
import { useLogout } from "@/hooks/auth/useLogout";
import { useToaster } from "@/hooks/ui/useToaster";
import { logoutAdmin } from "@/services/auth/authService";
import { adminLogout } from "@/store/slices/admin.slice";
import { useAppDispatch } from "@/store/store";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AdminSettingsPage = () => {
	const { mutate: logoutReq } = useLogout(logoutAdmin);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { successToast, errorToast } = useToaster();

	const handleLogout = () => {
		logoutReq(undefined, {
			onSuccess: (data) => {
				dispatch(adminLogout());
				successToast(data.message);
				navigate("/admin");
			},
			onError: (err: any) => {
				errorToast(err.response.data.message);
			},
		});
	};
	return (
		<motion.div
			key={"admin-settings"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-4">
			<Settings
				userRole="admin"
				profileUrl="/admin/settings/profile"
				securityUrl="/admin/settings/change-password"
				onLogout={handleLogout}
			/>
		</motion.div>
	);
};
