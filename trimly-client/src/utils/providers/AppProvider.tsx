import { StrictMode } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { ToastContainer } from "./ToastContainer";
import { LoadingProvider } from "@/hooks/common/useLoading";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<StrictMode>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<QueryClientProvider client={queryClient}>
						<LoadingProvider>
							<ToastContainer>{children}</ToastContainer>
						</LoadingProvider>
					</QueryClientProvider>
				</PersistGate>
			</Provider>
		</StrictMode>
	);
}
