import React from "react";
import { Toaster } from "react-hot-toast";

export function ToastContainer({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster position="top-right" />
		</>
	);
}
