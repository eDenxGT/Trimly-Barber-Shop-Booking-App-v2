import ForgotPassword from "@/components/auth/ForgotPassword";
import ResetPassword from "@/components/auth/ResetPassword";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import { ClientAuth } from "@/pages/client/ClientAuth";
import { ClientHomePage } from "@/pages/client/ClientHomePage";
import { ClientChangePasswordPage } from "@/pages/client/settings/ClientChangePasswordPage";
import { ClientProfileEditPage } from "@/pages/client/settings/ClientProfileEditPage";
import { ClientSettingsPage } from "@/pages/client/settings/ClientSettingsPage";
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
				}>
				<Route path="home" element={<ClientHomePage />} />

				<Route path="settings" element={<ClientSettingsPage />} />
				<Route
					path="settings/change-password"
					element={<ClientChangePasswordPage />}
				/>
				<Route
					path="settings/profile"
					element={<ClientProfileEditPage />}
				/>
			</Route>

			{/*//? Forgot and reset pages */}
			<Route
				path="/forgot-password"
				element={
					<NoAuthRoute
						element={
							<ForgotPassword role="client" signInPath="/" />
						}
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
