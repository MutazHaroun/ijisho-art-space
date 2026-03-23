import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";

// Public Pages
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FavoritesPage from "./pages/FavoritesPage";
import TrackOrder from "./pages/TrackOrder";
import PaymentPage from "./pages/PaymentPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyOrders from "./pages/MyOrders";

// Auth Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Register from "./pages/admin/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ArtworkForm from "./pages/admin/ArtworkForm";
import MessagesPage from "./pages/admin/MessagesPage";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 200);

    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showLoader && (
        <div
          className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
            isFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <SplashScreen />
        </div>
      )}

      <div
        className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ${
          showLoader ? "overflow-hidden h-screen" : ""
        }`}
      >
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:id" element={<ArtworkDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/artworks/new" element={<ArtworkForm />} />
              <Route path="/admin/artworks/:id/edit" element={<ArtworkForm />} />
              <Route path="/admin/messages" element={<MessagesPage />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            </Route>

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center py-20">
                  <h1 className="text-6xl font-black text-gray-200 dark:text-gray-700">
                    404
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300">
                    Page Not Found
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
