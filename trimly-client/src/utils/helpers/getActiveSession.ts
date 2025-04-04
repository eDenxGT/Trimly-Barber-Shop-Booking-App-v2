import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

  export const getActiveSession = createSelector(
	(state: RootState) => state.client.client,
	(state: RootState) => state.barber.barber,
	(state: RootState) => state.admin.admin,
	(client, barber, admin) => {
		if (client) return { role: client.role, type: "client" };
		if (barber) return { role: barber.role, type: "barber" };
		if (admin) return { role: admin.role, type: "admin" };
		return null;
	}
);
