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
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group w-full h-full"
    >
      <Link
        href={route('products.show', product.slug)}
        className="block h-full w-full"
        aria-label={`View ${product.name} details`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full w-full flex flex-col border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-500 relative">

          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-700 relative">
            <LazyImage
              src={
                (product.images?.length > 0 && product.images[0].image_url) ||
                (product.images?.length > 0 && product.images[0].url ? `/storage/${product.images[0].url}` : null) ||
                `/assets/default-product.png`
              }
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
              width="300"
              height="300"
            />

            {/* Sale Badge */}
            {product.sale_price && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-20">
                -{Math.round((1 - product.sale_price / product.price) * 100)}%
              </div>
            )}

            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
                <div className="bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-lg">
                  {t('products.out_of_stock')}
                </div>
              </div>
            )}

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-20">
              <WishlistButton
                productId={product.id}
                isLiked={product.is_liked}
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:scale-110 rounded-full p-2 border border-gray-200 dark:border-gray-600"
              />
            </div>

          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Category & Rating */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-pink-600 dark:text-pink-400 uppercase tracking-wide font-medium">
                {product.category?.name || 'Beauty'}
              </span>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center bg-yellow-400 rounded-lg px-2 py-1">
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
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="mt-auto mb-3">
              {product.sale_price ? (
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                    €{product.sale_price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    €{product.price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  €{product.price}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart === product.id || product.stock === 0}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center space-x-2 text-sm ${
                product.stock === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : addingToCart === product.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-600 hover:bg-pink-700 text-white shadow-md hover:shadow-lg'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {addingToCart === product.id ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : product.stock === 0 ? (
                <span>{t('products.out_of_stock')}</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
