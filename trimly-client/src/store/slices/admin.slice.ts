import { IAdmin } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
	admin: IAdmin | null;
}

const initialState: AdminState = {
	admin: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		adminLogin: (state, action: PayloadAction<IAdmin>) => {
			state.admin = action.payload;
		},
		adminLogout: (state) => {
			state.admin = null;
		},
	},
});

export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
