import { refreshAdminSession } from "@/services/admin/adminService";
import { IAdmin } from "@/types/User";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
	admin: IAdmin | null;
}

const initialState: AdminState = {
	admin: null,
};

export const refreshAdminSessionThunk = createAsyncThunk<
	{ user: IAdmin },
	void,
	{ rejectValue: string }
>("admin/refreshSession", async (_, { rejectWithValue }) => {
	try {
		const { user } = await refreshAdminSession();

		const mappedAdmin: IAdmin = {
			userId: user.userId,
			fullName: (user as IAdmin).fullName,
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			avatar: user.avatar ?? "",
			status: user.status,
			isSuperAdmin: (user as IAdmin).isSuperAdmin ?? false,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return { user: mappedAdmin };
	} catch (err) {
		console.log(err);
		return rejectWithValue("Failed to refresh session");
	}
});

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
	extraReducers: (builder) => {
		builder
			.addCase(refreshAdminSessionThunk.fulfilled, (state, action) => {
				state.admin = action.payload.user;
			})
			.addCase(refreshAdminSessionThunk.rejected, (_, action) => {
				console.error(action.payload || "Session refresh failed");
			});
	},
});

export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
