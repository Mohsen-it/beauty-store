import React from 'react';
import { motion } from 'framer-motion';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <motion.button
            {...props}
            whileHover={!disabled ? { scale: 1.03 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={
                `relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600
                hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm tracking-wide
                rounded-xl shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-700/30
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
                dark:focus:ring-pink-400 dark:ring-offset-gray-900
                transition-all duration-300 overflow-hidden
                ${disabled && 'opacity-50 cursor-not-allowed'} ` + className
            }
            disabled={disabled}
        >
            <span className="relative z-10">{children}</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-hover:from-pink-400/30 group-hover:to-purple-500/30 transition-colors duration-300"></span>
        </motion.button>
    );
}
