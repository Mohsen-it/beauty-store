import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenuTest = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    console.log('Close menu called');
    setMobileMenuOpen(false);
  };

  console.log('MobileMenuTest render - mobileMenuOpen:', mobileMenuOpen);

  return (
    <>
      <Head title="Mobile Menu Test" />
      
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl">
                  Cosmetics Store Test
                </span>
              </div>
              
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-3 bg-pink-500 text-white rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-pink-600 transition-colors"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-[9997]">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9998] bg-black/60"
                onClick={closeMenu}
                aria-hidden="true"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="fixed inset-y-0 left-0 z-[9999] w-[85%] max-w-sm bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
              >
                <div className="h-full flex flex-col">
                  {/* Menu header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl">
                      Test Menu
                    </span>
                    <button
                      onClick={closeMenu}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close menu"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Menu content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-2">
                      <div className="text-xs uppercase text-gray-500 mb-3 font-medium tracking-wider">
                        القائمة الرئيسية
                      </div>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        الرئيسية
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        المنتجات
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        الفئات
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        من نحن
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        اتصل بنا
                      </a>
                    </nav>

                    {/* Auth section */}
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <div className="text-xs uppercase text-gray-500 mb-3 font-medium tracking-wider">
                        الحساب
                      </div>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                          تسجيل الدخول
                        </a>
                        <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                          إنشاء حساب
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mobile Menu Test Page</h1>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
            <div className="space-y-2">
              <p>Menu State: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{mobileMenuOpen ? 'OPEN' : 'CLOSED'}</span></p>
              <p>Screen Width: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</span></p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p>هذه صفحة اختبار للقائمة المحمولة.</p>
            <p>اضغط على زر الهامبرغر في الأعلى لفتح القائمة.</p>
            <p>تحقق من وحدة التحكم في المتصفح للحصول على معلومات التشخيص.</p>
            
            <button
              onClick={toggleMenu}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default MobileMenuTest;
