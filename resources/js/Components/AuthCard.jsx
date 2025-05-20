import React from 'react';
import { motion } from 'framer-motion';

export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <div className="w-full sm:max-w-md px-6 py-4 relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-300/10 to-purple-400/10 dark:from-pink-700/10 dark:to-purple-800/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-300/10 to-cyan-400/10 dark:from-blue-700/10 dark:to-cyan-800/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-8 sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 w-full"
        >
          {/* Auth card header */}
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent"
            >
              {title}
            </motion.h2>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto"></div>
          </div>
          
          {/* Auth card content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
