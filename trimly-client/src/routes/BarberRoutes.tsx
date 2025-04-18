import { BarberLayout } from "@/components/layouts/BarberLayout";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";
import { BarberAuth } from "@/pages/barber/BarberAuth";
import ResetPassword from "@/components/auth/ResetPassword";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { BarberProfileEditPage } from "@/pages/barber/settings/BarberProfileEditPage";
import { BarberChangePasswordPage } from "@/pages/barber/settings/BarberChangePasswordPage";
import { BarberServiceManagementPage } from "@/pages/barber/settings/BarberServiceManagementPage";
import { BarberOpeningHoursPage } from "@/pages/barber/settings/BarberOpeningHoursPage";
import { BarberSettingsPage } from "@/pages/barber/settings/BarberSettingsPage";

export const BarberRoutes = () => {
	return (
		<Routes>
			<Route index element={<NoAuthRoute element={<BarberAuth />} />} />
			<Route
				path="/"
				element={
					<ProtectedRoute
						allowedRoles={["barber"]}
						element={<BarberLayout />}
					/>
				}>
				{/* <Route path="dashboard" element={<BarberDashboard />} />
				*/}
				<Route path="settings" element={<BarberSettingsPage />} />
				<Route
					path="settings/services"
					element={<BarberServiceManagementPage />}
				/>
				<Route
					path="settings/opening-hours"
					element={<BarberOpeningHoursPage />}
				/>
				<Route
					path="settings/change-password"
					element={<BarberChangePasswordPage />}
				/>
				<Route
					path="settings/profile"
					element={<BarberProfileEditPage />}
				/>
				{/* <Route path="shop" element={<BarberShopList />} />
				<Route path="shop/:shopId" element={<BarberShopDetails role="barber" />} />
				<Route path="shop/:shopId/edit" element={<BarberShopEditPage />} />
				<Route path="shop/create" element={<BarberShopRegister />} /> 
				*/}
			</Route>

			{/*//? Forgot and reset pages */}
			<Route
				path="/forgot-password"
				element={
					<NoAuthRoute
						element={
							<ForgotPassword
								role="barber"
								signInPath="/barber"
							/>
						}
					/>
				}
			/>
			<Route
				path="/reset-password/:token"
				element={
					<NoAuthRoute
						element={
							<ResetPassword role="barber" signInPath="/barber" />
						}
					/>
				}
			/>
		</Routes>
	);
};
