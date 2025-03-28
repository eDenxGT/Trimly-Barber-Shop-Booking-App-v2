import axios from "axios";
import toast from "react-hot-toast";
import { store } from "@/store/store";
import { barberLogout } from "@/store/slices/barber.slice";

export const barberAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_PRIVATE_API_URL + "/_ba",
	withCredentials: true,
});

let isRefreshing = false;

barberAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await barberAxiosInstance.post("/barber/refresh-token");
					isRefreshing = false;
					return barberAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					store.dispatch(barberLogout());

					window.location.href = "/";
					toast("Please login again");
					return Promise.reject(refreshError);
				}
			}
		}

		if (
			(error.response.status === 403 &&
				error.response.data.message === "Token is blacklisted") ||
			(error.response.status === 403 &&
				error.response.data.message ===
					"Access denied: Your account has been blocked" &&
				!originalRequest._retry)
		) {
			console.log("Session ended");
			store.dispatch(barberLogout());

			window.location.href = "/barber";
			toast("Please login again");
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);
