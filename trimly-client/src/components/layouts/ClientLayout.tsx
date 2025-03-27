import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { PrivateHeader } from "@/components/headers/PrivateHeader";
// import { AppSidebar } from "@/components/mainComponents/h";
// import { useLogout } from "@/hooks/auth/useLogout";
// import { logoutClient } from "@/services/auth/authService";
import { useDispatch, useSelector } from "react-redux";
import { clientLogout } from "@/store/slices/client.slice";
import { useToaster } from "@/hooks/ui/useToaster";
import { RootState } from "@/store/store";
import { PrivateHeader } from "./../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/SideBar";
import { useLogout } from "@/hooks/auth/useLogout";
import { logoutClient } from "@/services/auth/authService";

export const ClientLayout = () => {
	const [isSideBarVisible, setIsSideBarVisible] = useState(false);
	const [notifications] = useState(2);
	const { successToast, errorToast } = useToaster();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.client.client);
	const { mutate: logoutReq } = useLogout(logoutClient);

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
		<div className="flex flex-col min-h-screen">
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
				role="client"
				isVisible={isSideBarVisible}
				onClose={() => setIsSideBarVisible(false)}
				handleLogout={handleLogout}
			/>
			{/* Main content */}
			<Outlet />
		</div>
	);
};
