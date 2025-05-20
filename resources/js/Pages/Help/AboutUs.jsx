import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { t } from '@/utils/translate';

const AboutUs = () => {
  return (
    <CinematicLayout>
      <Head title={`${t('common.about_us')} - ${t('app.title')}`} />

      <div className="cinematic-container py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {t('about.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 sm:p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6"
                >
                  {t('about.our_story')}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6"
                >
                  {t('about.story_content')}
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 mt-6 sm:mt-8"
                >
                  {t('about.our_mission')}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6"
                >
                  {t('about.mission_content')}
                </motion.p>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-5 sm:mb-6 mt-6 sm:mt-8">
                  {t('about.our_values')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {t('about.quality')}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {t('about.quality_desc')}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {t('about.sustainability')}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {t('about.sustainability_desc')}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {t('about.inclusivity')}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {t('about.inclusivity_desc')}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {t('about.transparency')}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {t('about.transparency_desc')}
                    </p>
                  </motion.div>
                </div>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 mt-6 sm:mt-8"
                >
                  {t('about.our_commitment')}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
                >
                  {t('about.commitment_content')}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CinematicLayout>
  );
};

export default AboutUs;
