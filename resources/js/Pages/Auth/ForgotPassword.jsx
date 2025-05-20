import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import CinematicLayout from '@/Layouts/CinematicLayout';
import AuthCard from '@/Components/AuthCard';
import { motion } from 'framer-motion';
import { t } from '@/utils/translate';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <CinematicLayout>
            <Head title={t('auth.forgot_password')} />

            <AuthCard title={t('auth.reset_password')}>
                {status ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    >
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{status}</p>
                    </motion.div>
                ) : (
                    <div className="mb-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                        {t('auth.reset_instructions')}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            }
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder={t('auth.enter_email')}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            {t('auth.send_reset_link')}
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                {t('auth.remember_password')}
                            </span>
                        </div>
                    </div>

                    <motion.div
                        className="mt-6"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            href={route('login')}
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition-all duration-300"
                        >
                            {t('auth.back_to_login')}
                        </Link>
                    </motion.div>
                </div>
            </AuthCard>
        </CinematicLayout>
    );
}
