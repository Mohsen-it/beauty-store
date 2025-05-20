import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const TermsOfService = () => {
  return (
    <CinematicLayout>
      <Head title={`${t('terms.title')} - ${t('app.title')}`} />

      <div className="cinematic-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('terms.description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose prose-pink max-w-none dark:prose-invert"
              >
                <h2>{t('terms.acceptance')}</h2>
                <p>
                  {t('terms.acceptance_content')}
                </p>

                <h2>{t('terms.changes')}</h2>
                <p>
                  {t('terms.changes_content')}
                </p>

                <h2>{t('terms.registration')}</h2>
                <p>
                  {t('terms.registration_content')}
                </p>

                <h2>{t('terms.conduct')}</h2>
                <p>
                  {t('terms.conduct_content')}
                </p>

                <h2>{t('terms.products')}</h2>
                <p>
                  {t('terms.products_content')}
                </p>

                <h2>{t('terms.payment')}</h2>
                <p>
                  {t('terms.payment_content')}
                </p>

                <h2>{t('terms.shipping')}</h2>
                <p>
                  {t('terms.shipping_content')}
                </p>

                <h2>{t('terms.returns')}</h2>
                <p>
                  {t('terms.returns_content')}
                </p>

                <h2>{t('terms.intellectual')}</h2>
                <p>
                  {t('terms.intellectual_content')}
                </p>

                <h2>{t('terms.liability')}</h2>
                <p>
                  {t('terms.liability_content')}
                </p>

                <h2>{t('terms.governing')}</h2>
                <p>
                  {t('terms.governing_content')}
                </p>

                <h2>{t('terms.contact')}</h2>
                <p>
                  {t('terms.contact_content')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CinematicLayout>
  );
};

export default TermsOfService;
