import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // التحقق من حالة تسجيل الدخول
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    setOpen(false);
    navigate("/admin/login");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-white py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          
          {/* --- Logo --- */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0b1120] rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-orange-600 transition-colors duration-300">
              I
            </div>
            <span className="text-xl font-black text-[#0b1120] tracking-tighter">
              Ijisho <span className="text-orange-600">Art</span> Space
            </span>
          </Link>

          {/* --- Desktop Links --- */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-orange-600 ${
                  isActive(link.to) ? "text-orange-600" : "text-gray-500"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* --- Auth Buttons Section --- */}
            <div className="flex items-center gap-4 border-l pl-8 border-gray-100 ml-2">
              {token ? (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`text-sm font-black uppercase tracking-widest hover:text-blue-600 transition-colors ${isActive("/admin/dashboard") ? "text-blue-600" : "text-gray-900"}`}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/admin/login" 
                    className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-orange-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-[#0b1120] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            className="md:hidden p-2 text-[#0b1120]"
            onClick={() => setOpen(!open)}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-2" : "w-6"}`}></span>
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "opacity-0" : "w-4"}`}></span>
              <span className={`h-1 bg-current rounded-full transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* --- Mobile Sidebar --- */}
      <div 
        className={`absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-50 md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[600px] py-8" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`text-2xl font-black transition-colors ${
                isActive(link.to) ? "text-orange-600" : "text-[#0b1120]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="h-px bg-gray-100 my-4"></div>
          
          {token ? (
            <div className="flex flex-col gap-4">
              <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="text-xl font-black text-blue-600">Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-xl font-black text-red-600">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Link to="/admin/login" onClick={() => setOpen(false)} className="text-xl font-black text-[#0b1120]">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="bg-[#0b1120] text-white py-4 rounded-2xl text-center text-lg font-black uppercase tracking-widest shadow-xl">
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

