import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const PrivacyPolicy = () => {
  return (
    <CinematicLayout>
      <Head title={`${t('privacy.title')} - ${t('app.title')}`} />

      <div className="cinematic-container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('privacy.description')}
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
                <h2>{t('privacy.information_collect')}</h2>
                <p>
                  {t('privacy.information_collect_desc')}
                </p>
                <ul>
                  <li>{t('privacy.contact_info')}</li>
                  <li>{t('privacy.account_info')}</li>
                  <li>{t('privacy.payment_info')}</li>
                  <li>{t('privacy.order_history')}</li>
                  <li>{t('privacy.communications')}</li>
                </ul>

                <h2>{t('privacy.information_use')}</h2>
                <p>
                  {t('privacy.information_use_desc')}
                </p>
                <ul>
                  <li>{t('privacy.process_orders')}</li>
                  <li>{t('privacy.manage_account')}</li>
                  <li>{t('privacy.communicate')}</li>
                  <li>{t('privacy.improve_website')}</li>
                  <li>{t('privacy.detect_fraud')}</li>
                  <li>{t('privacy.comply_legal')}</li>
                </ul>

                <h2>{t('privacy.information_sharing')}</h2>
                <p>
                  {t('privacy.information_sharing_desc')}
                </p>
                <ul>
                  <li>{t('privacy.service_providers')}</li>
                  <li>{t('privacy.payment_processors')}</li>
                  <li>{t('privacy.shipping_companies')}</li>
                  <li>{t('privacy.legal_authorities')}</li>
                </ul>
                <p>
                  {t('privacy.no_selling')}
                </p>

                <h2>{t('privacy.cookies')}</h2>
                <p>
                  {t('privacy.cookies_desc')}
                </p>

                <h2>{t('privacy.data_security')}</h2>
                <p>
                  {t('privacy.data_security_desc')}
                </p>

                <h2>{t('privacy.your_rights')}</h2>
                <p>
                  {t('privacy.your_rights_desc')}
                </p>
                <ul>
                  <li>{t('privacy.access_info')}</li>
                  <li>{t('privacy.correction_info')}</li>
                  <li>{t('privacy.deletion_info')}</li>
                  <li>{t('privacy.restriction_info')}</li>
                  <li>{t('privacy.portability_info')}</li>
                </ul>

                <h2>{t('privacy.children')}</h2>
                <p>
                  {t('privacy.children_desc')}
                </p>

                <h2>{t('privacy.changes')}</h2>
                <p>
                  {t('privacy.changes_desc')}
                </p>

                <h2>{t('privacy.contact')}</h2>
                <p>
                  {t('privacy.contact_desc')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CinematicLayout>
  );
};

export default PrivacyPolicy;
