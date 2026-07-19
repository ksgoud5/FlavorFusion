// frontend/src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// This layout wraps around every page via React Router's nested routes.
// <Outlet /> is a placeholder where the matched child route's component renders.
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;