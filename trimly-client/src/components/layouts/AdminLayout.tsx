import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/auth/useLogout";
import { useSelector } from "react-redux";
import { useToaster } from "@/hooks/ui/useToaster";
import { RootState, useAppDispatch } from "@/store/store";
import { logoutAdmin } from "@/services/auth/authService";
import { adminLogout, refreshAdminSessionThunk } from "@/store/slices/admin.slice";
import { PrivateHeader } from "../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/SideBar";

export const AdminLayout = () => {
	const [isSideBarVisible, setIsSideBarVisible] = useState(false);
	const [notifications] = useState(2);
	const { successToast, errorToast } = useToaster();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.admin.admin);
	const { mutate: logoutReq } = useLogout(logoutAdmin);

	const handleLogout = () => {
		logoutReq(undefined, {
			onSuccess: (data) => {
				dispatch(adminLogout());
				navigate("/admin");
				successToast(data.message);
			},
			onError: (err: any) => {
				errorToast(err.response.data.message);
			},
		});
	};

	useEffect(() => {
		const handleFocus = () => {
			dispatch(refreshAdminSessionThunk());
		};

		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("focus", handleFocus);
		};
	}, [dispatch]);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			{/* Header */}
			<PrivateHeader
				className="z-40"
				user={user}
				onLogout={handleLogout}
				notifications={notifications}
				onSidebarToggle={() => setIsSideBarVisible(!isSideBarVisible)}
			/>

			{/* Main content area with sidebar and outlet */}
			<Sidebar
				role="admin"
				isVisible={isSideBarVisible}
				onClose={() => setIsSideBarVisible(false)}
				handleLogout={handleLogout}
			/>
			{/* Main content */}
			<Outlet context={user}/>
		</div>
	);
};
