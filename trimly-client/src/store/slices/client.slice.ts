import { IClient } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClientState {
	client: IClient | null;
}

const initialState: ClientState = {
	client: null,
};

const clientSlice = createSlice({
	name: "client",
	initialState,
	reducers: {
		clientLogin: (state, action: PayloadAction<IClient>) => {
			state.client = action.payload;
		},
		clientLogout: (state) => {
			state.client = null;
		},
	},
});

export const { clientLogin, clientLogout } = clientSlice.actions;
export default clientSlice.reducer;
