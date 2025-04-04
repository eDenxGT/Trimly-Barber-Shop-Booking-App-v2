import { refreshClientSession } from "@/services/client/clientService";
import { IClient } from "@/types/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClientState {
	client: IClient | null;
}

const initialState: ClientState = {
	client: null,
};

export const refreshClientSessionThunk = createAsyncThunk<
	{ user: IClient },
	void,
	{ rejectValue: string }
>("client/refreshSession", async (_, { rejectWithValue }) => {
	try {
		const { user } = await refreshClientSession();
		const mappedUser: IClient = {
			userId: user.userId,
			fullName: (user as IClient).fullName,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
			phoneNumber: user.phoneNumber,
			status: user.status,
			googleId: (user as IClient).googleId,
			location: (user as IClient).location,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
		return { user: mappedUser };
	} catch (err) {
		console.log(err);
		return rejectWithValue("Failed to refresh session");
	}
});

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
	extraReducers: (builder) => {
		builder
			.addCase(refreshClientSessionThunk.fulfilled, (state, action) => {
				state.client = action.payload.user;
			})
			.addCase(refreshClientSessionThunk.rejected, (_, action) => {
				console.error(action.payload || "Session refresh failed");
			});
	},
});

export const { clientLogin, clientLogout } = clientSlice.actions;
export default clientSlice.reducer;
