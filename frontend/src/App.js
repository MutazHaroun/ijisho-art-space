import React from "react";
import { Routes, Route } from "react-router-dom";
import FavoritesPage from "./pages/FavoritesPage";
import MessagesPage from "./pages/admin/MessagesPage";
import AdminProfile from "./pages/admin/AdminProfile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import Register from "./pages/admin/Register";
import AboutPage from "./pages/AboutPage";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ArtworkForm from "./pages/admin/ArtworkForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<ArtworkDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/artworks/new" element={<ArtworkForm />} />
            <Route path="/admin/artworks/:id/edit" element={<ArtworkForm />} />
            <Route path="/admin/messages" element={<MessagesPage />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
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
  );
}

export default App;
