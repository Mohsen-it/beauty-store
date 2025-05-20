import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const FavoritesIndex = ({ likedProducts }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleUnlike = (productId) => {
    axios.post(route('products.toggle-like', productId))
      .then(() => {
        // Refresh the page to update the list
        window.location.reload();
      })
      .catch(error => {
        console.error('Error unliking product:', error);
      });
  };

  return (
    <CinematicLayout>
      <Head title={`${t('favorites.title')} - ${t('app.title')}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-cinematic-900 dark:text-white mb-8"
        >
          {t('favorites.title')}
        </motion.h1>

        {likedProducts.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {likedProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-md dark:shadow-soft hover:shadow-xl dark:hover:shadow-soft-lg transition-shadow duration-300 border border-cinematic-200 dark:border-cinematic-700">
                  <Link href={route('products.show', product.slug)}>
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={
                          product.image
                            ? `/storage/${product.image}?v=${new Date().getTime()}`
                            : product.images && product.images[0]?.url
                              ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                              : `/assets/default-product.png?v=${new Date().getTime()}`
                        }
                        alt={product.name}
                        className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm text-cinematic-500 dark:text-cinematic-400">{product.category ? product.category.name : 'Uncategorized'}</h3>
                      <p className="mt-1 text-lg font-medium text-cinematic-900 dark:text-white">{product.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                        {product.sale_price ? (
                                <div className="flex items-center">
                                  <span className="text-lg text-primary-600 dark:text-primary-400">${product.sale_price}</span>
                                  <span className="ml-2 text-sm text-cinematic-500 dark:text-cinematic-400 line-through">${product.price}</span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-primary-600 dark:text-primary-600">${product.price}</span>
                              )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4 flex justify-between">
                    <Link
                      href={route('products.show', product.slug)}
                      className="text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
                    >
                      {t('common.view_details')}
                    </Link>
                    <button
                      onClick={() => handleUnlike(product.id)}
                      className="text-sm font-medium text-cinematic-600 dark:text-cinematic-400 hover:text-cinematic-800 dark:hover:text-cinematic-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-pink-600 dark:text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cinematic-400 dark:text-cinematic-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-cinematic-900 dark:text-white">{t('favorites.empty_title')}</h2>
            <p className="mt-2 text-cinematic-600 dark:text-cinematic-400">{t('favorites.empty_message')}</p>
            <Link
              href={route('products.index')}
              className="mt-6 inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white font-medium rounded-md transition-colors duration-300"
            >
              {t('common.browse_products')}
            </Link>
          </div>
        )}
      </div>
    </CinematicLayout>
  );
};

export default FavoritesIndex;
