import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function WebsiteLayout() {
  return (
    <div className="website-layout">
      <Navbar />

      <main className="website-layout__content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}