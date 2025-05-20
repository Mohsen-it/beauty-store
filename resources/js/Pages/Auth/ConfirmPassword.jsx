import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import CinematicLayout from '@/Layouts/CinematicLayout';
import AuthCard from '@/Components/AuthCard';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <CinematicLayout>
            <Head title="Confirm Password" />

            <AuthCard title="Security Verification">
                <div className="mb-6 text-sm text-gray-600 dark:text-gray-400 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>

                    <p>
                        This is a secure area of the application. Please confirm your password before continuing.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Confirm Password
                        </PrimaryButton>
                    </div>
                </form>
            </AuthCard>
        </CinematicLayout>
    );
}
