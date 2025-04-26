import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToaster } from "@/hooks/ui/useToaster";
import { RootState, useAppDispatch } from "@/store/store";
import { PrivateHeader } from "./../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/SideBar";
import { useLogout } from "@/hooks/auth/useLogout";
import { logoutBarber } from "@/services/auth/authService";
import {
  barberLogout,
  refreshBarberSessionThunk,
} from "@/store/slices/barber.slice";
import { ConnectSocket } from "@/lib/socket/ConnectSocket";

export const BarberLayout = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const [notifications] = useState(2);
  const { successToast, errorToast } = useToaster();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.barber.barber);
  const { mutate: logoutReq } = useLogout(logoutBarber);

  const handleLogout = () => {
    logoutReq(undefined, {
      onSuccess: (data) => {
        dispatch(barberLogout());
        navigate("/barber");
        successToast(data.message);
      },
      onError: (err: any) => {
        errorToast(err.response.data.message);
      },
    });
  };

  useEffect(() => {
    const handleFocus = () => {
      dispatch(refreshBarberSessionThunk());
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {user && <ConnectSocket user={user} />}

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
      <Outlet context={user} />
    </div>
  );
};
