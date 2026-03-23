import React from 'react';
import { FaEye } from 'react-icons/fa'; // سنستخدم FaEye لشعار العين

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      
      {/* 1. حاوية شعار العين المتحرك */}
      <div className="relative flex items-center justify-center">
        {/* خلفية دائرية برتقالية متحركة (Pulse) */}
        <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-orange-200 dark:bg-orange-900 opacity-50 blur-lg"></div>

        {/* شعار العين */}
        <div className="p-4 bg-orange-600 text-white rounded-2xl shadow-2xl relative z-10 transition-transform animate-bounce">
          <FaEye size={48} />
        </div>
      </div>

      {/* 2. اسم Ijisho Art Space */}
      <div className="mt-8 text-center">
        <span className="text-3xl font-extrabold tracking-tighter text-[#0b1120] dark:text-white">
          Ijisho <span className="text-orange-600">Art</span> Space
        </span>
      </div>

      {/* 3. الـ Spinner الدائري */}
      <div className="mt-12 h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-orange-600 dark:border-gray-800"></div>

    </div>
  );
};

export default SplashScreen;