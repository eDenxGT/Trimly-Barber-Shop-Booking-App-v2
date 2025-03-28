import { IBarber } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BarberState {
	barber: IBarber | null;
}

const initialState: BarberState = {
	barber: null,
};

const barberSlice = createSlice({
	name: "barber",
	initialState,
	reducers: {
		barberLogin: (state, action: PayloadAction<IBarber>) => {
			state.barber = action.payload;
		},
		barberLogout: (state) => {
			state.barber = null;
		},
	},
});

export const { barberLogin, barberLogout } = barberSlice.actions;
export default barberSlice.reducer;
