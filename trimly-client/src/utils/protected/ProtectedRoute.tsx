import { createSelector } from "reselect";
import { RootState } from "@/store/store";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { JSX } from "react";

export const getActiveSession = createSelector(
	(state: RootState) => state.client.client,
	(state: RootState) => state.barberShop.barberShop,
	(state: RootState) => state.admin.admin,
	(client, barber, admin) => {
		if (client) return { role: client.role, type: "client" };
		if (barber) return { role: barber.role, type: "barberShop" };
		if (admin) return { role: admin.role, type: "admin" };
		return null;
	}
);

interface ProtectedRouteProps {
	element: JSX.Element;
	allowedRoles: string[];
}

export const ProtectedRoute = ({
	element,
	allowedRoles,
}: ProtectedRouteProps) => {
	const session = useSelector(getActiveSession);

	if (!session) return <Navigate to="/" />;
	if (!allowedRoles.includes(session.role))
		return <Navigate to="/unauthorized" />;

	return element;
};
