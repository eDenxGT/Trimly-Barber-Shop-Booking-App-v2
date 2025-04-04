import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { refreshAdminSessionThunk } from "@/store/slices/admin.slice";
import { refreshBarberSessionThunk } from "@/store/slices/barber.slice";
import { refreshClientSessionThunk } from "@/store/slices/client.slice";

type UserRole = "client" | "barber" | "admin";

const useRefreshSession = (role: UserRole | null) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (role === "client") dispatch(refreshClientSessionThunk());
		else if (role === "barber") dispatch(refreshBarberSessionThunk());
		else if (role === "admin") dispatch(refreshAdminSessionThunk());
	}, [dispatch, role]);
};

export default useRefreshSession;
