import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export const getCurrentUserDetails = createSelector(
  (state: RootState) => state.client.client,
  (state: RootState) => state.barber.barber,
  (state: RootState) => state.admin.admin,
  (client, barber, admin) => {
    if (client) return client;
    if (barber) return barber;
    if (admin) return admin;
    return null;
  }
);
