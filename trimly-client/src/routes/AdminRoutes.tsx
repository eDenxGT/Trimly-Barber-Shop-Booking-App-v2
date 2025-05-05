import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { AdminAuth } from "@/pages/admin/AdminAuth";
import { AdminDashBoardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminBarberShopApplicationPage } from "@/pages/admin/applications/AdminBarberApplicationPage";
import { AdminUserWithdrawalsPage } from "@/pages/admin/applications/AdminUserWithdrawalsPage";
import { AdminCommunityListPage } from "@/pages/admin/community/AdminCommunityListPage";
import { AdminCreateCommunityPage } from "@/pages/admin/community/AdminCreateCommunityPage";
import { AdminEditCommunityPage } from "@/pages/admin/community/AdminEditCommunityPage";
import { AdminMeetingsPage } from "@/pages/admin/community/AdminMeetingsListPage";
import { AdminScheduleMeetingPage } from "@/pages/admin/community/AdminScheduleMeetingPage";
import { AdminHairstylesListPage } from "@/pages/admin/hairstyle-detector/AdminHairstylesListPage";
import { AdminBarberManagementPage } from "@/pages/admin/managementPages/AdminBarberShopManagementPage";
import { AdminClientManagementPage } from "@/pages/admin/managementPages/AdminClientManagementPage";
import { AdminChangePasswordPage } from "@/pages/admin/settings/AdminChangePasswordPage";
import { AdminProfileEditPage } from "@/pages/admin/settings/AdminProfileEditPage";
import { AdminSettingsPage } from "@/pages/admin/settings/AdminSettingsPage";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<NoAuthRoute element={<AdminAuth />} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin"]} element={<AdminLayout />} />
        }
      >
        <Route path="dashboard" element={<AdminDashBoardPage />} />

        <Route path="shops" element={<AdminBarberManagementPage />} />
        <Route path="clients" element={<AdminClientManagementPage />} />
        <Route path="communities" element={<AdminCommunityListPage />} />
        <Route
          path="communities/create"
          element={<AdminCreateCommunityPage />}
        />
        <Route
          path="communities/edit/:communityId"
          element={<AdminEditCommunityPage />}
        />

        <Route
          path="communities/:communityId/schedule-meeting"
          element={<AdminScheduleMeetingPage />}
        />
        <Route path="communities/meetings" element={<AdminMeetingsPage />} />
        <Route
          path="shop-applications"
          element={<AdminBarberShopApplicationPage />}
        />

        <Route
          path="withdrawal-requests"
          element={<AdminUserWithdrawalsPage />}
        />

        <Route
          path="hairstyles"
          element={<AdminHairstylesListPage />}
        />

        <Route path="settings" element={<AdminSettingsPage />} />
        <Route
          path="settings/change-password"
          element={<AdminChangePasswordPage />}
        />
        <Route path="settings/profile" element={<AdminProfileEditPage />} />
      </Route>

      {/*//? Forgot and reset pages */}
      <Route
        path="/forgot-password"
        element={
          <NoAuthRoute
            element={<ForgotPassword role="admin" signInPath="/admin" />}
          />
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <NoAuthRoute
            element={<ResetPassword role="admin" signInPath="/admin" />}
          />
        }
      />
    </Routes>
  );
};
