import { Routes, Route, Navigate } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import CustomPrintingPage from "./pages/CustomPrintingPage.jsx";
import DesignServicesPage from "./pages/DesignServicesPage.jsx";
import BulkOrdersPage from "./pages/BulkOrdersPage.jsx";
import PhotoTo3DPage from "./pages/PhotoTo3DPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import { PersonalizedGiftsPage, KidsCreativeKitsPage } from "./pages/ServicePages.jsx";
import { FAQPage } from "./pages/InfoPages.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        {/* Main pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/personalized-gifts" element={<PersonalizedGiftsPage />} />
        <Route path="/kids-creative-kits" element={<KidsCreativeKitsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Services */}
        <Route
          path="/custom-printing"
          element={<CustomPrintingPage />}
        />
        <Route
          path="/design-services"
          element={<DesignServicesPage />}
        />
        <Route
          path="/bulk-orders"
          element={<BulkOrdersPage />}
        />
        <Route
          path="/photo-to-3d"
          element={<PhotoTo3DPage />}
        />

        {/* Cart and Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Contact */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
