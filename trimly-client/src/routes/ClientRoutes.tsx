import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import { ClientBookingPage } from "@/pages/client/booking/ClientBookingPage";
import { ClientMyBookingsPage } from "@/pages/client/booking/ClientMyBookingsPage";
import { ClientChatPage } from "@/pages/client/chat/ClientChatPage";
import { ClientAuth } from "@/pages/client/ClientAuth";
import { ClientHomePage } from "@/pages/client/ClientHomePage";
import { ClientPostDetailsPage } from "@/pages/client/feed/ClientPostDetailsPage";
import { ClientSocialFeedPage } from "@/pages/client/feed/ClientSocialFeedPage";
import { ClientChangePasswordPage } from "@/pages/client/settings/ClientChangePasswordPage";
import { ClientProfileEditPage } from "@/pages/client/settings/ClientProfileEditPage";
import { ClientSettingsPage } from "@/pages/client/settings/ClientSettingsPage";
import { ClientShopDetailsPage } from "@/pages/client/shop/ClientShopDetailsPage";
import ShopListingPage from "@/pages/client/shop/ClientShopListingPage";
import ClientWalletPage from "@/pages/client/wallet/ClientWalletPage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<ClientAuth />} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={["client"]}
            element={<ClientLayout />}
          />
        }
      >
        <Route path="home" element={<ClientHomePage />} />

        <Route path="shops" element={<ShopListingPage />} />
        <Route path="chat" element={<ClientChatPage />} />
        <Route
          path="shops/:shopId"
          element={<ClientShopDetailsPage role="client" />}
        />

        <Route path="shops/:shopId/booking" element={<ClientBookingPage />} />

        <Route path="my-bookings" element={<ClientMyBookingsPage />} />

        <Route path="wallet" element={<ClientWalletPage />} />

        <Route path="feed" element={<ClientSocialFeedPage />} />

        <Route path="feed/post/:postId" element={<ClientPostDetailsPage />} />

        <Route path="settings" element={<ClientSettingsPage />} />

        <Route
          path="settings/change-password"
          element={<ClientChangePasswordPage />}
        />

        <Route path="settings/profile" element={<ClientProfileEditPage />} />
      </Route>

      {/*//? Forgot and reset pages */}
      <Route
        path="/forgot-password"
        element={
          <NoAuthRoute
            element={<ForgotPassword role="client" signInPath="/" />}
          />
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="client" signInPath="/" />}
          />
        }
      />
    </Routes>
  );
};
