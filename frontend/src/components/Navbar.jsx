import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import api from "../api/axios";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const isLoggedIn = !!userRole;
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-950");
      document.body.classList.remove("bg-white");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-950");
      document.body.classList.add("bg-white");
    }

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem("visitorCounted");

    if (!alreadyCounted) {
      const currentVisitors =
        Number(localStorage.getItem("siteVisitors")) || 0;
      localStorage.setItem("siteVisitors", currentVisitors + 1);
      sessionStorage.setItem("visitorCounted", "true");
    }
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      // ignore, as we still want to log the user out client-side
    }

    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setOpen(false);
    toast.info("Logged out successfully");
    navigate("/");
  };

  const handleLogoSecretClick = (e) => {
    e.preventDefault();

    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (nextCount >= 2) {
      setLogoClicks(0);
      navigate("/admin/login");
    }

    setTimeout(() => {
      setLogoClicks(0);
    }, 1000);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/favorites", label: "Favorites" },
    { to: "/contact", label: "Contact" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white dark:bg-gray-900 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            onClick={handleLogoSecretClick}
            className="group flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-[#0b1120] dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-[#0b1120] font-black text-xl group-hover:bg-orange-600 transition-colors duration-300">
              I
            </div>
            <span className="text-xl font-black text-[#0b1120] dark:text-white tracking-tighter">
              Ijisho <span className="text-orange-600">Art</span> Space
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-orange-600 ${
                  isActive(link.to)
                    ? "text-orange-600"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-orange-600 ${
                isActive("/cart")
                  ? "text-orange-600"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <FaShoppingCart className="text-base" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            <div className="flex items-center gap-4 border-l pl-8 border-gray-100 dark:border-gray-700 ml-2">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-black uppercase tracking-widest hover:text-blue-600 transition-colors ${
                      isActive("/admin/dashboard")
                        ? "text-blue-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/profile"
                    className={`text-sm font-black uppercase tracking-widest hover:text-purple-600 transition-colors ${
                      isActive("/admin/profile")
                        ? "text-purple-600"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/register"
                  className="bg-[#0b1120] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
                >
                  Register
                </Link>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-[#0b1120] dark:text-white"
            onClick={() => setOpen(!open)}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span
                className={`h-1 bg-current rounded-full transition-all duration-300 ${
                  open ? "w-6 rotate-45 translate-y-2" : "w-6"
                }`}
              ></span>
              <span
                className={`h-1 bg-current rounded-full transition-all duration-300 ${
                  open ? "opacity-0" : "w-4"
                }`}
              ></span>
              <span
                className={`h-1 bg-current rounded-full transition-all duration-300 ${
                  open ? "w-6 -rotate-45 -translate-y-2" : "w-5"
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-50 dark:border-gray-800 md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[800px] py-8" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`text-2xl font-black transition-colors ${
                isActive(link.to)
                  ? "text-orange-600"
                  : "text-[#0b1120] dark:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Cart */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-2xl font-black text-[#0b1120] dark:text-white"
          >
            <FaShoppingCart />
            Cart
            {cartCount > 0 && (
              <span className="min-w-[28px] h-7 px-2 flex items-center justify-center rounded-full bg-red-500 text-white text-sm font-black">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleDarkMode}
            className="text-left text-xl font-black text-[#0b1120] dark:text-white"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>

          {isAdmin ? (
            <div className="flex flex-col gap-4">
              <Link
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="text-xl font-black text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/profile"
                onClick={() => setOpen(false)}
                className="text-xl font-black text-purple-600"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-xl font-black text-red-600"
              >
                Logout
              </button>
            </div>
          ) : isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <button
                onClick={handleLogout}
                className="text-left text-xl font-black text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="bg-[#0b1120] text-white py-4 rounded-2xl text-center text-lg font-black uppercase tracking-widest shadow-xl"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

