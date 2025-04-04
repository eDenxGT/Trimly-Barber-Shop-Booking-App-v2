import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { JSX } from "react";
import { getActiveSession } from "../helpers/getActiveSession";

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
	if (!allowedRoles.includes(session.role as string))
		return <Navigate to="/unauthorized" />;

	return element;
};
