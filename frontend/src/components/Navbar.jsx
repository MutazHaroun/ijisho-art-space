import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaShoppingCart, FaSun, FaMoon, FaHeart, FaEye } from "react-icons/fa"; 
import api from "../api/axios";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const location = useLocation();
  const navigate = useNavigate();

  // فحص حالة تسجيل الدخول ودور المستخدم
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
    const updateCartCount = async () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
      if (cart.length === 0) {
        setCartTotal(0);
        return;
      }
      try {
        const responses = await Promise.all(
          cart.map((id) => api.get(`/gallery/${id}`))
        );
        const total = responses.reduce((sum, res) => sum + Number(res.data.price || 0), 0);
        setCartTotal(total);
      } catch (error) {
        setCartTotal(0);
      }
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

useEffect(() => {
  let interval;

  const loadUnread = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUnreadCount(0);
        return;
      }

      const res = await api.get(`/notifications/unread-count?user_id=${userId}`);
      setUnreadCount(res.data?.unread_count || 0);
    } catch (err) {
      console.error("Notifications error:", err);
    }
  };

  loadUnread();

  // 🔥 تحديث كل 5 ثواني
  interval = setInterval(loadUnread, 5000);

  // 🔁 تحديث عند events
  const refresh = () => loadUnread();
  window.addEventListener("notificationsUpdated", refresh);

  return () => {
    clearInterval(interval);
    window.removeEventListener("notificationsUpdated", refresh);
  };
}, []);

  const handleLogout = async () => {
    try { await api.post("/admin/logout"); } catch (err) {}
    localStorage.clear();
    setOpen(false);
    toast.info("Logged out successfully");
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 ${
      isScrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-3" : "bg-white dark:bg-gray-900 py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          
          {/* 1. الجانب الأيسر: روابط الصفحات العادية */}
          <div className="hidden md:flex flex-1 items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[12px] lg:text-[13px] font-black uppercase tracking-widest transition-all hover:text-orange-600 whitespace-nowrap ${
                  isActive(link.to) ? "text-orange-600" : "text-gray-500 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 2. المنتصف: اللوغو */}
          <div className="flex justify-center flex-shrink-0 mx-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="p-2 bg-orange-600 text-white rounded-xl shadow-lg transition-transform group-hover:scale-110">
                <FaEye size={22} />
              </div>
              <span className="text-lg lg:text-2xl font-black tracking-tighter text-[#0b1120] dark:text-white whitespace-nowrap">
                Ijisho <span className="text-orange-600">Art</span> Space
              </span>
            </Link>
          </div>

          {/* 3. الجانب الأيمن: المفضلة، السلة، الإعدادات، وأزرار الحساب */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4 lg:gap-6">
            
            <Link 
              to="/favorites" 
              className={`text-xl transition-all hover:scale-110 ${isActive("/favorites") ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
              title="Favorites"
            >
              <FaHeart />
            </Link>

            <Link to="/cart" className={`relative flex items-center gap-2 transition-all hover:text-orange-600 ${isActive("/cart") ? "text-orange-600" : "text-gray-500 dark:text-gray-300"}`}>
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black border-2 border-white dark:border-gray-900">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            <Link
  to="/notifications"
  className={`relative text-xl transition-all hover:scale-110 ${
    isActive("/notifications")
      ? "text-orange-600"
      : "text-gray-400 dark:text-gray-500"
  }`}
  title="Notifications"
>
  {unreadCount > 0 ? "🔔" : "🔕"}

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-2 min-w-[18px] h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black border-2 border-white dark:border-gray-900">
      {unreadCount}
    </span>
  )}
</Link>

<Link
  to="/my-orders"
  className={`text-[12px] lg:text-[13px] font-black uppercase tracking-widest transition-all hover:text-orange-600 whitespace-nowrap ${
    isActive("/my-orders")
      ? "text-orange-600"
      : "text-gray-500 dark:text-gray-300"
  }`}
>
  My Orders
</Link>

            {/* منطقة أزرار تسجيل الدخول والداشبورد */}
            <div className="flex items-center gap-3 border-l pl-4 border-gray-100 dark:border-gray-700">
              
              {/* إذا كان المستخدم أدمن، يظهر زر الداشبورد هنا بجانب زر الخروج */}
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm ${
                    isActive("/admin/dashboard") 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {isLoggedIn ? (
                <button 
                  onClick={handleLogout} 
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-red-100 transition-all active:scale-95"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/admin/login" 
                  className="bg-[#0b1120] text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-orange-600 transition-all shadow-sm active:scale-95"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* زر الموبايل */}
          <button className="md:hidden p-2 text-[#0b1120] dark:text-white" onClick={() => setOpen(!open)}>
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-2" : "w-6"}`}></span>
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "opacity-0" : "w-4"}`}></span>
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل المنسدلة (محدثة لتشمل الداشبورد في الأسفل) */}
      <div className={`absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-2xl md:hidden overflow-hidden transition-all duration-500 ${open ? "max-h-screen py-8 border-t border-gray-100 dark:border-gray-800" : "max-h-0"}`}>
        <div className="flex flex-col gap-6 px-10">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className={`text-2xl font-black uppercase tracking-widest ${isActive(link.to) ? "text-orange-600" : "text-gray-900 dark:text-white"}`}>
              {link.label}
            </Link>
          ))}
          
          <Link to="/favorites" onClick={() => setOpen(false)} className="flex items-center gap-3 text-2xl font-black uppercase text-red-500">
            <FaHeart /> Favorites
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-3 text-2xl font-black uppercase text-orange-600">
            <FaShoppingCart /> Cart ({cartCount})
          </Link>
<Link
  to="/notifications"
  onClick={() => setOpen(false)}
  className="flex items-center justify-between text-2xl font-black uppercase"
>
  <span>🔔 Notifications</span>

  {unreadCount > 0 && (
    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
      {unreadCount}
    </span>
  )}
</Link>

          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="text-2xl font-black uppercase text-blue-600 border-t pt-4 border-gray-100 dark:border-gray-800">
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

