import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const Shipping = ({ shippingInfo }) => {
  return (
    <CinematicLayout>
      <Head title={`${t('shipping.title')} - ${t('app.title')}`} />

      <div className="cinematic-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('shipping.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('shipping.description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('shipping.domestic_title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('shipping.standard_shipping')}
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.delivery_time')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.domestic.standard.time}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.cost')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.domestic.standard.cost}</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('shipping.express_shipping')}
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.delivery_time')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.domestic.express.time}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.cost')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.domestic.express.cost}</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('shipping.international_title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('shipping.standard_international')}
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.delivery_time')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.international.standard.time}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.cost')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.international.standard.cost}</span>
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('shipping.express_international')}
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.delivery_time')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.international.express.time}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{t('shipping.cost')}:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{shippingInfo.international.express.cost}</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('shipping.policies_title')}
                </h2>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('shipping.order_processing')}:</strong> {t('shipping.order_processing_desc')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('shipping.tracking')}:</strong> {t('shipping.tracking_desc')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('shipping.customs')}:</strong> {t('shipping.customs_desc')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('shipping.restrictions')}:</strong> {t('shipping.restrictions_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('shipping.questions_help')}
            </p>
            <Link
              href={route('help.contact')}
              className="inline-block bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
            >
              {t('common.contact_us')}
            </Link>
          </div>
        </div>
      </div>
    </CinematicLayout>
  );
};

export default Shipping;
