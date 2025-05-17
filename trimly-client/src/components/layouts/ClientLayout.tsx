import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  clientLogout,
  refreshClientSessionThunk,
} from "@/store/slices/client.slice";
import { useToaster } from "@/hooks/ui/useToaster";
import { RootState, useAppDispatch } from "@/store/store";
import { PrivateHeader } from "./../mainComponents/PrivateHeader";
import { Sidebar } from "../mainComponents/SideBar";
import { useLogout } from "@/hooks/auth/useLogout";
import { logoutClient } from "@/services/auth/authService";
import { ConnectSocket } from "@/lib/socket/ConnectSocket";
import Footer from "../mainComponents/Footer";

export const ClientLayout = () => {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const { successToast, errorToast } = useToaster();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.client.client);
  const { mutate: logoutReq } = useLogout(logoutClient);

  const isChatPage = location.pathname.startsWith("/chat");

  const handleLogout = () => {
    logoutReq(undefined, {
      onSuccess: (data) => {
        dispatch(clientLogout());
        navigate("/");
        successToast(data.message);
      },
      onError: (err: any) => {
        errorToast(err.response.data.message);
      },
    });
  };

  useEffect(() => {
    const handleFocus = () => {
      dispatch(refreshClientSessionThunk());
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
      <Outlet context={user} />
      {!isChatPage && <Footer />}
    </div>
  );
};
