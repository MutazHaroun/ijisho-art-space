import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // الحارس الذي أنشأناه

// Public Pages
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import Register from "./pages/admin/Register"; // صفحة التسجيل الجديدة

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ArtworkForm from "./pages/admin/ArtworkForm";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* القائمة العلوية ثابتة في كل الصفحات */}
      <Navbar />

      {/* الجزء المتغير من الصفحة */}
      <main className="flex-grow">
        <Routes>
          {/* --- 1. المسارات العامة (متاحة للجميع) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<ArtworkDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* --- 2. المسارات المحمية (للمسؤول فقط) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/artworks/new" element={<ArtworkForm />} />
            <Route path="/admin/artworks/:id/edit" element={<ArtworkForm />} />
          </Route>

          {/* --- 3. صفحة الخطأ 404 (اختياري) --- */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-6xl font-black text-gray-200">404</h1>
              <p className="text-gray-500">Page Not Found</p>
            </div>
          } />
        </Routes>
      </main>

      {/* التذييل ثابت في أسفل كل الصفحات */}
      <Footer />
    </div>
  );
}

export default App;
