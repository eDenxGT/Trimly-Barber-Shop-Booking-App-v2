import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToaster } from "@/hooks/ui/useToaster";
import { RootState } from "@/store/store";
import { PrivateHeader } from "./../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/SideBar";
import { useLogout } from "@/hooks/auth/useLogout";
import { logoutBarber } from "@/services/auth/authService";
import { barberLogout } from "@/store/slices/barber.slice";

export const BarberLayout = () => {
	const [isSideBarVisible, setIsSideBarVisible] = useState(false);
	const [notifications] = useState(2);
	const { successToast, errorToast } = useToaster();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.barber.barber);
	const { mutate: logoutReq } = useLogout(logoutBarber);

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
				role="barber"
				isVisible={isSideBarVisible}
				onClose={() => setIsSideBarVisible(false)}
				handleLogout={handleLogout}
			/>
			{/* Main content */}
			<Outlet />
		</div>
	);
};
