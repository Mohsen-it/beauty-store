import React from 'react';
import { motion } from 'framer-motion';

/**
 * Floating label input component for better form UX
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type
 * @param {string} props.label - Input label
 * @param {string} props.name - Input name
 * @param {string} props.id - Input ID
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Function to call when input changes
 * @param {string} props.className - Additional classes to apply to the input
 * @param {string} props.labelClassName - Additional classes to apply to the label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the input is required
 * @returns {JSX.Element} - Floating label input component
 */
export default function FloatingLabelInput({
    type = 'text',
    label,
    name,
    id,
    value,
    onChange,
    className = '',
    labelClassName = '',
    error,
    required = false,
    ...props
}) {
    const inputId = id || name;
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== '';
    const shouldFloat = isFocused || hasValue;

    return (
        <div className="relative">
            <motion.div
                className="relative group"
                initial={false}
                animate={{ 
                    scale: shouldFloat ? 1 : 1,
                    borderColor: error ? 'rgb(239, 68, 68)' : isFocused ? 'rgb(236, 72, 153)' : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.input
                    type={type}
                    name={name}
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`
                        peer w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 dark:border-gray-700
                        bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2
                        focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent
                        dark:text-gray-100 shadow-sm placeholder-transparent
                        transition-all duration-300 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}
                    `}
                    placeholder={label}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                <motion.label
                    htmlFor={inputId}
                    className={`
                        absolute text-gray-500 dark:text-gray-400 duration-300 transform 
                        -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-3
                        ${error ? 'text-red-500' : isFocused ? 'text-pink-500 dark:text-pink-400' : ''}
                        ${labelClassName}
                    `}
                    initial={false}
                    animate={{ 
                        y: shouldFloat ? -12 : 0,
                        scale: shouldFloat ? 0.75 : 1,
                        color: error ? 'rgb(239, 68, 68)' : isFocused ? 'rgb(236, 72, 153)' : ''
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </motion.label>
            </motion.div>
            {error && (
                <motion.p 
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

/**
 * Floating label textarea component
 */
export function FloatingLabelTextarea({
    label,
    name,
    id,
    value,
    onChange,
    className = '',
    labelClassName = '',
    error,
    required = false,
    rows = 4,
    ...props
}) {
    const inputId = id || name;
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== '';
    const shouldFloat = isFocused || hasValue;

    return (
        <div className="relative">
            <motion.div
                className="relative group"
                initial={false}
                animate={{ 
                    scale: shouldFloat ? 1 : 1,
                    borderColor: error ? 'rgb(239, 68, 68)' : isFocused ? 'rgb(236, 72, 153)' : 'rgb(209, 213, 219)'
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.textarea
                    name={name}
                    id={inputId}
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    className={`
                        peer w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 dark:border-gray-700
                        bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2
                        focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent
                        dark:text-gray-100 shadow-sm placeholder-transparent resize-y
                        transition-all duration-300 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}
                    `}
                    placeholder={label}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                ></motion.textarea>
                <motion.label
                    htmlFor={inputId}
                    className={`
                        absolute text-gray-500 dark:text-gray-400 duration-300 transform 
                        -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-3
                        ${error ? 'text-red-500' : isFocused ? 'text-pink-500 dark:text-pink-400' : ''}
                        ${labelClassName}
                    `}
                    initial={false}
                    animate={{ 
                        y: shouldFloat ? -12 : 0,
                        scale: shouldFloat ? 0.75 : 1,
                        color: error ? 'rgb(239, 68, 68)' : isFocused ? 'rgb(236, 72, 153)' : ''
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </motion.label>
            </motion.div>
            {error && (
                <motion.p 
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
