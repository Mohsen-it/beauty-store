import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import CinematicLayout from '@/Layouts/CinematicLayout';
import AuthCard from '@/Components/AuthCard';
import { motion } from 'framer-motion';
import { t } from '@/utils/translate';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <CinematicLayout>
            <Head title={t('auth.verify_email')} />

            <AuthCard title={t('auth.verify_email')}>
                <div className="mb-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        {t('auth.verification_notice')}
                    </p>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                        {t('auth.verification_not_received')}
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    >
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 text-center">
                            {t('auth.verification_sent')}
                        </p>
                    </motion.div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="flex flex-col space-y-4">
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Resend Verification Email
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition-all duration-300"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </CinematicLayout>
    );
}
