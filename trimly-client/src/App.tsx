import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./utils/ScrollToTop";
import { UnauthorizedPage } from "./pages/common/UnauthorizedPage";
import LoadingUi from "./components/modals/LoadingModal";
import ClientRoutes from "./routes/ClientRoutes";

const BarberRoutes = lazy(() => import("./routes/BarberRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<ClientRoutes />} />

        {/* Lazy-loaded routes */}
        <Route
          path="/barber/*"
          element={
            <Suspense fallback={<LoadingUi />}>
              <BarberRoutes />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<LoadingUi />}>
              <AdminRoutes />
            </Suspense>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
