import { IBarberShop } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BarberState {
	barberShop: IBarberShop | null;
}

const initialState: BarberState = {
	barberShop: null,
};

const barberShopSlice = createSlice({
	name: "barberShop",
	initialState,
	reducers: {
		barberShopLogin: (state, action: PayloadAction<IBarberShop>) => {
			state.barberShop = action.payload;
		},
		barberShopLogout: (state) => {
			state.barberShop = null;
		},
	},
});

export const { barberShopLogin, barberShopLogout } = barberShopSlice.actions;
export default barberShopSlice.reducer;
