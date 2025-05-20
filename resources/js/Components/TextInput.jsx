import React from 'react';
import { motion } from 'framer-motion';

export default function TextInput({ type = 'text', className = '', isFocused = false, icon = null, ...props }) {
    const input = React.useRef();

    React.useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{icon}</span>
                </div>
            )}
            <motion.input
                {...props}
                type={type}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={
                    `w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-xl border border-gray-200 dark:border-gray-700
                    bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2
                    focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent
                    dark:text-gray-100 shadow-sm placeholder-gray-400 dark:placeholder-gray-500
                    transition-all duration-300 ${className}`
                }
                ref={input}
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-focus-within:from-pink-400/10 group-focus-within:to-purple-500/10 transition-colors duration-300"></div>
        </div>
    );
}
