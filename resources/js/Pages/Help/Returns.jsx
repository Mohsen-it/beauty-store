import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const Returns = ({ returnsPolicy }) => {
  return (
    <CinematicLayout>
      <Head title={`${t('returns.page_title')} - ${t('app.title')}`} />

      <div className="cinematic-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('returns.page_title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('returns.page_description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('returns.policy_overview')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('returns.timeframe_title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {returnsPolicy.timeframe}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('returns.condition_title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {returnsPolicy.condition}
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('returns.process_title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {returnsPolicy.process}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {t('returns.refund_title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {returnsPolicy.refund}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  {t('returns.exceptions_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {returnsPolicy.exceptions}
                </p>
              </motion.div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('returns.detailed_instructions')}
                </h2>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 1:</strong> {t('returns.step1')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 2:</strong> {t('returns.step2')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 3:</strong> {t('returns.step3')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 4:</strong> {t('returns.step4')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 5:</strong> {t('returns.step5')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 6:</strong> {t('returns.step6')}
                  </p>
                  <p>
                    <strong className="text-gray-900 dark:text-white">{t('returns.step')} 7:</strong> {t('returns.step7')}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('returns.damaged_items')}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('returns.damaged_description')}
                </p>

                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>{t('returns.include_order')}</li>
                  <li>{t('returns.include_description')}</li>
                  <li>{t('returns.include_photos')}</li>
                </ul>

                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  {t('returns.replacement_promise')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('returns.questions_help')}
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

export default Returns;
