import React, { memo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import LazyImage from '@/Components/LazyImage';
import WishlistButton from '@/Components/WishlistButton';
import { t } from '@/utils/translate';

const ProductCard = memo(({ product, onAddToCart, addingToCart }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group w-full h-full"
    >
      <Link
        href={route('products.show', product.slug)}
        className="block h-full w-full"
        aria-label={`View ${product.name} details`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full w-full flex flex-col border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-600 min-h-[300px]">

          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 relative">
            <LazyImage
              src={
                (product.images?.length > 0 && product.images[0].image_url) ||
                (product.images?.length > 0 && product.images[0].url ? `/storage/${product.images[0].url}` : null) ||
                `/assets/default-product.png`
              }
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              width="300"
              height="300"
            />

            {/* Sale Badge */}
            {product.sale_price && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg z-10">
                -{Math.round((1 - product.sale_price / product.price) * 100)}%
              </div>
            )}

            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <span className="text-white font-semibold text-xs bg-red-600 px-3 py-1 rounded-lg">
                  {t('products.out_of_stock')}
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <div className="absolute top-2 right-2 z-10">
              <WishlistButton
                productId={product.id}
                isLiked={product.is_liked}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 min-h-[36px] min-w-[36px] flex items-center justify-center"
              />
            </div>

            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
            {/* Category & Rating */}
            <div className="flex justify-between items-start mb-1 sm:mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium truncate flex-1 mr-2">
                {product.category?.name}
              </span>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-xs font-bold text-white">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 break-words">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-auto mb-2 sm:mb-3">
              {product.sale_price ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-pink-600 dark:text-pink-400">
                    €{product.sale_price}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                    €{product.price}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  €{product.price}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={addingToCart === product.id || product.stock === 0}
              className={`w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 min-h-[40px] sm:min-h-[44px] flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                product.stock === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : addingToCart === product.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {addingToCart === product.id ? (
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : product.stock === 0 ? (
                <span className="text-xs sm:text-sm">{t('products.out_of_stock')}</span>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden sm:inline text-xs sm:text-sm">{t('cart.add_to_cart')}</span>
                  <span className="sm:hidden text-xs">Add</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
