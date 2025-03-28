import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { PublicRoutes } from "./components/routes/PublicRoutes";
import { ClientRoutes } from "./routes/ClientRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import { UnauthorizedPage } from "./pages/common/UnauthorizedPage";
import { BarberRoutes } from "./routes/BarberRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
	return (
		<Router>
			<ScrollToTop />
			<Routes>
				<Route path="/*" element={<ClientRoutes />} />
				<Route path="/barber/*" element={<BarberRoutes />} />
				<Route path="/admin/*" element={<AdminRoutes />} />
				<Route path="/unauthorized" element={<UnauthorizedPage />} /> 
			</Routes>
		</Router>
	);
}

export default App;
