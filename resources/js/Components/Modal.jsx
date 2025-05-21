import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    title = null,
    footer = null,
    fullScreenOnMobile = false
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        '5xl': 'sm:max-w-5xl',
        'full': 'sm:max-w-full',
    }[maxWidth];

    // Determine if we should use full screen on mobile
    const mobileFullScreenClass = fullScreenOnMobile
        ? 'h-screen sm:h-auto rounded-none sm:rounded-lg'
        : 'rounded-lg';

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center justify-center z-50 transform transition-all"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-cinematic-900/70 dark:bg-cinematic-950/80 backdrop-blur-sm" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`w-full mx-auto mb-6 bg-white dark:bg-cinematic-800 overflow-hidden shadow-xl transform transition-all
                        ${mobileFullScreenClass} ${maxWidthClass} max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col`}
                    >
                        {/* Modal Header with Title */}
                        {title && (
                            <div className="px-4 sm:px-6 py-3 sm:py-4 text-cinematic-900 dark:text-white border-b border-cinematic-200 dark:border-cinematic-700 flex items-center justify-between">
                                <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
                                {closeable && (
                                    <button
                                        onClick={close}
                                        className="text-cinematic-500 hover:text-cinematic-700 dark:text-cinematic-400 dark:hover:text-cinematic-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full p-1"
                                        aria-label="Close"
                                    >
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Modal Content */}
                        <div className={`px-4 sm:px-6 py-3 sm:py-4 text-cinematic-900 dark:text-white flex-1 overflow-y-auto ${!title && !footer ? 'border-b border-cinematic-200 dark:border-cinematic-700' : ''}`}>
                            {children}
                        </div>

                        {/* Modal Footer */}
                        {footer && (
                            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cinematic-50 dark:bg-cinematic-900 border-t border-cinematic-200 dark:border-cinematic-700">
                                {footer}
                            </div>
                        )}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
