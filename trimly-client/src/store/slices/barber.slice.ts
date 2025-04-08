import { refreshBarberSession } from "@/services/barber/barberService";
import { IBarber } from "@/types/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BarberState {
	barber: IBarber | null;
}

const initialState: BarberState = {
	barber: null,
};

export const refreshBarberSessionThunk = createAsyncThunk<
	{ user: IBarber },
	void,
	{ rejectValue: string }
>("barber/refreshSession", async (_, { rejectWithValue }) => {
	try {
		const { user } = await refreshBarberSession();
		const mappedBarber: IBarber = {
			userId: user.userId,
			shopName: (user as IBarber).shopName ?? "",
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			status: user.status,
			avatar: user.avatar ?? "",
			banner: (user as IBarber).banner ?? "",
			rejectionReason: (user as IBarber).rejectionReason ?? "",
			location: (user as IBarber).location ?? {},
			description: (user as IBarber).description ?? "",
			openingHours: (user as IBarber).openingHours ?? {},
			amenities: (user as IBarber).amenities,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
		return { user: mappedBarber };
	} catch (err) {
		console.log(err);
		return rejectWithValue("Failed to refresh session");
	}
});

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
	extraReducers: (builder) => {
		builder
			.addCase(refreshBarberSessionThunk.fulfilled, (state, action) => {	
				state.barber = action.payload.user;
			})
			.addCase(refreshBarberSessionThunk.rejected, (_, action) => {
				console.error(action.payload || "Session refresh failed");
			});
	},
});

export const { barberLogin, barberLogout } = barberSlice.actions;
export default barberSlice.reducer;
