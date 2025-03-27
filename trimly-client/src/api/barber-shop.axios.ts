import axios from "axios";
import toast from "react-hot-toast";
import { store } from "@/store/store";
import { barberShopLogout } from "@/store/slices/barber-shop.slice";

export const barberShopAxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_PRIVATE_API_URL + "/_ba",
	withCredentials: true,
});

let isRefreshing = false;

barberShopAxiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			if (!isRefreshing) {
				isRefreshing = true;
				try {
					await barberShopAxiosInstance.post("/barber/refresh-token");
					isRefreshing = false;
					return barberShopAxiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;

					store.dispatch(barberShopLogout());

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
			store.dispatch(barberShopLogout());

			window.location.href = "/barber";
			toast("Please login again");
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);
