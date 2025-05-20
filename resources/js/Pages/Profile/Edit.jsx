import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <CinematicLayout
            user={auth.user}
            header={
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-semibold text-xl text-cinematic-900 dark:text-white leading-tight"
                >
                    Profile
                </motion.h2>
            }
        >
            <Head title="Profile" />

            <div className="py-8 sm:py-10 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 sm:p-8 bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg border border-cinematic-200 dark:border-cinematic-700"
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl mx-auto"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="p-4 sm:p-8 bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg border border-cinematic-200 dark:border-cinematic-700"
                    >
                        <UpdatePasswordForm className="max-w-xl mx-auto" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="p-4 sm:p-8 bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg border border-cinematic-200 dark:border-cinematic-700"
                    >
                        <DeleteUserForm className="max-w-xl mx-auto" />
                    </motion.div>
                </div>
            </div>
        </CinematicLayout>
    );
}
