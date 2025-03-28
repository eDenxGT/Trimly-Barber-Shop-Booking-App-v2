import { BarberLayout } from "@/components/layouts/BarberLayout";
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute";
import { NoAuthRoute } from "@/utils/protected/PublicRoute";
import { Route, Routes } from "react-router-dom";
import { BarberAuth } from '@/pages/barber/BarberAuth';
import ResetPassword from "@/components/auth/ResetPassword";
import ForgotPassword from "@/components/auth/ForgotPassword";

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
				<Route path="settings" element={<BarberSettingsPage />} />
				<Route
					path="settings/change-password"
					element={<BarberChangePassword />}
				/>
				<Route
					path="settings/profile"
					element={<BarberProfileEdit />}
				/>
				<Route path="shop" element={<BarberShopList />} />
				<Route path="shop/:shopId" element={<BarberShopDetails role="barber" />} />
				<Route path="shop/:shopId/edit" element={<BarberShopEditPage />} />
				<Route path="shop/create" element={<BarberShopRegister />} /> */}
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
