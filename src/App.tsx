import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/navbar.tsx";
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from "./components/SessionGate";
import ApplicationPage from "./pages/ApplicationPage";
import Countries from "./pages/Countries";
import CTA from "./pages/CTA";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./pages/Footer";
import Hero from "./pages/Hero";
import ClientDashboard from "./pages/ClientDashboard";
import ResetPassword from "./pages/ResetPassword";
import Service from "./pages/Service";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Testimonials from "./pages/Testimonials";
import VerifyEmail from "./pages/VerifyEmail";
import { ROUTES } from "./lib/routes";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";

const Home = () => (
  <>
    <Hero />
    <Service />
    <CTA />
    <Countries />
    <Testimonials />
    <Footer />
  </>
);

const App = () => {
  const location = useLocation();

  return (
    <>
      <NavBar pathname={location.pathname} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ROUTES.APPLICATION} element={<ApplicationPage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<SignIn />} />
          <Route path={ROUTES.REGISTER} element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.CLIENT.ROOT} element={<ClientDashboard />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN.ROOT} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN.APPLICATIONS} element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
