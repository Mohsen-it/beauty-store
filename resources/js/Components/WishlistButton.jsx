import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { t } from '@/utils/translate';
import toast from 'react-hot-toast';

const WishlistButton = ({ productId, isLiked: initialIsLiked = false, className = '', size = 'md' }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!window.Laravel?.user) {
      toast.error(t('auth.login_required', 'Please login to add items to your wishlist'));
      router.visit(route('login'));
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      const response = await axios.post(route('products.toggle-like', productId));
      
      // Update with server response
      setIsLiked(response.data.is_liked);
      
      // Show success message
      if (response.data.is_liked) {
        toast.success(t('wishlist.added', 'Added to wishlist'));
      } else {
        toast.success(t('wishlist.removed', 'Removed from wishlist'));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      setIsLiked(!newLikedState);
      
      if (error.response?.status === 401) {
        toast.error(t('auth.login_required', 'Please login to add items to your wishlist'));
        router.visit(route('login'));
      } else {
        toast.error(t('common.error', 'Something went wrong. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${className}
        relative overflow-hidden
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={isLiked ? t('products.remove_from_wishlist') : t('products.add_to_wishlist')}
      title={isLiked ? t('products.remove_from_wishlist') : t('products.add_to_wishlist')}
    >
      {/* Background pulse effect when liked */}
      {isLiked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 bg-pink-100 dark:bg-pink-900/30 rounded-full"
        />
      )}

      {/* Loading spinner */}
      {isLoading ? (
        <svg 
          className={`${iconSizes[size]} animate-spin text-pink-500`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        /* Heart icon */
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSizes[size]} relative z-10 transition-colors duration-300 ${
            isLiked 
              ? 'text-pink-500 dark:text-pink-400' 
              : 'text-gray-400 dark:text-gray-500 hover:text-pink-500 dark:hover:text-pink-400'
          }`}
          fill={isLiked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={isLiked ? 0 : 2}
          initial={false}
          animate={{
            scale: isLiked ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </motion.svg>
      )}

      {/* Floating hearts animation when liked */}
      {isLiked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0], 
                x: [0, (i - 1) * 10, (i - 1) * 15],
                y: [0, -10, -20],
                rotate: [0, (i - 1) * 45, (i - 1) * 90]
              }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <svg 
                className="w-3 h-3 text-pink-400" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.button>
  );
};

export default WishlistButton;
