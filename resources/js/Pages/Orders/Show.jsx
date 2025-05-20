import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import CinematicLayout from '@/Layouts/CinematicLayout';

import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import '../../../css/orders.css';
import { usePage } from '@inertiajs/react';

export default function OrderShow({ auth, order, orderHistory }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showModifyModal, setShowModifyModal] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        reason: '',
    });
    const currency = usePage().props.currencySymbol;

    const { data: modifyData, setData: setModifyData, post: postModify, processing: modifyProcessing, reset: resetModify, errors: modifyErrors } = useForm({
        address: order.address,
        city: order.city,
        state: order.state || '',
        postal_code: order.postal_code,
        country: order.country,
        phone: order.phone || '',
        notes: order.notes || '',
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'PPP', { locale: enUS });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'processing':
                return 'Processing';
            case 'shipped':
                return 'Shipped';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    const canCancel = ['pending', 'processing'].includes(order.status);
    const canModify = ['pending'].includes(order.status);

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        post(route('orders.cancel', order.id), {
            onSuccess: () => {
                reset();
                setShowCancelModal(false);
            },
        });
    };

    const handleModifySubmit = (e) => {
        e.preventDefault();
        postModify(route('orders.modify', order.id), {
            onSuccess: () => {
                resetModify();
                setShowModifyModal(false);
            },
        });
    };

    return (
        <CinematicLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-cinematic-900 dark:text-white leading-tight">Order Details #{order.order_number}</h2>}
        >
            <Head title={`Order details #${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('orders.index')}
                            className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 transition-colors duration-150"
                        >
                            &larr; Back to Orders
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-sm dark:shadow-soft sm:rounded-lg mb-6 border border-cinematic-200 dark:border-cinematic-700">
                        <div className="p-6 text-cinematic-900 dark:text-white">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-cinematic-900 dark:text-white">Order Information</h3>
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-sm text-cinematic-600 dark:text-cinematic-400">Order Number:</p>
                                    <p className="font-medium">{order.order_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cinematic-600 dark:text-cinematic-400">Order Date:</p>
                                    <p className="font-medium">{formatDate(order.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-cinematic-600 dark:text-cinematic-400">Payment Method:</p>
                                    <p className="font-medium">
                                        {order.payment_method === 'credit_card' ? 'Credit Card' : 
                                         order.payment_method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-cinematic-600 dark:text-cinematic-400">Payment Status:</p>
                                    <p className="font-medium">
                                        {order.payment_status === 'pending' ? 'Pending' : 
                                         order.payment_status === 'paid' ? 'Paid' : 'Payment Failed'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-sm dark:shadow-soft sm:rounded-lg border border-cinematic-200 dark:border-cinematic-700">
                            <div className="p-6 text-cinematic-900 dark:text-white">
                                <h3 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Shipping Information</h3>
                                <div className="space-y-2">
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Name:</span> {order.first_name} {order.last_name}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Email:</span> {order.email}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Phone:</span> {order.phone || 'Not Available'}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Address:</span> {order.address}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">City:</span> {order.city}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">State/Region:</span> {order.state || 'Not Available'}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Postal Code:</span> {order.postal_code}</p>
                                    <p><span className="text-cinematic-600 dark:text-cinematic-400">Country:</span> {order.country}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-sm dark:shadow-soft sm:rounded-lg border border-cinematic-200 dark:border-cinematic-700">
                            <div className="p-6 text-cinematic-900 dark:text-white">
                                <h3 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Order Summary</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-cinematic-600 dark:text-cinematic-400">Subtotal:</span>
                                        <span>{order.subtotal}  {currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-cinematic-600 dark:text-cinematic-400">Tax:</span>
                                        <span>{order.tax} {currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-cinematic-600 dark:text-cinematic-400">Shipping:</span>
                                        <span>{order.shipping}  {currency}</span>
                                    </p>
                                    <p className="flex justify-between font-bold border-t border-cinematic-200 dark:border-cinematic-700 pt-2">
                                        <span>Total:</span>
                                        <span>{order.total}  {currency}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-sm dark:shadow-soft sm:rounded-lg mb-6 border border-cinematic-200 dark:border-cinematic-700">
                        <div className="p-6 text-cinematic-900 dark:text-white">
                            <h3 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Products</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-cinematic-200 dark:divide-cinematic-700">
                                    <thead className="bg-pink-50 dark:bg-cinematic-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-cinematic-200 dark:divide-cinematic-700">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-pink-50 dark:hover:bg-cinematic-700/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cinematic-900 dark:text-white">
                                                    {item.product_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cinematic-600 dark:text-cinematic-300">
                                                    {item.price}  {currency}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cinematic-600 dark:text-cinematic-300">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-cinematic-600 dark:text-cinematic-300">
                                                    {item.subtotal}  {currency}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {orderHistory && orderHistory.length > 0 && (
                        <div className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-sm dark:shadow-soft sm:rounded-lg mb-6 border border-cinematic-200 dark:border-cinematic-700">
                            <div className="p-6 text-cinematic-900 dark:text-white">
                                <h3 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Order History</h3>
                                <div className="space-y-4">
                                    {orderHistory.map((history) => (
                                        <div key={history.id} className="border-b border-cinematic-200 dark:border-cinematic-700 pb-3 last:border-b-0 last:pb-0">
                                            <div className="flex justify-between items-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(history.status)}`}>
                                                    {getStatusText(history.status)}
                                                </span>
                                                <span className="text-sm text-cinematic-600 dark:text-cinematic-400">{formatDate(history.created_at)}</span>
                                            </div>
                                            {history.comment && (
                                                <p className="mt-1 text-sm text-cinematic-600 dark:text-cinematic-400">{history.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        {canModify && (
                            <SecondaryButton onClick={() => setShowModifyModal(true)}>
                                Modify Order
                            </SecondaryButton>
                        )}
                        
                        {canCancel && (
                            <DangerButton onClick={() => setShowCancelModal(true)}>
                                Cancel Order
                            </DangerButton>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Order Modal */}
            <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <form onSubmit={handleCancelSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-cinematic-900 dark:text-white">
                        Cancel Order
                    </h2>
                    <p className="mt-1 text-sm text-cinematic-600 dark:text-cinematic-400">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="reason" value="Reason for cancellation (optional)" />
                        <TextArea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-1 block w-full"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowCancelModal(false)}>
                            Nevermind
                        </SecondaryButton>

                        <DangerButton className="ml-3" disabled={processing}>
                            Cancel Order
                        </DangerButton>
                    </div>
                </form>
            </Modal>

            {/* Modify Order Modal */}
            <Modal show={showModifyModal} onClose={() => setShowModifyModal(false)}>
                <form onSubmit={handleModifySubmit} className="p-6">
                    <h2 className="text-lg font-medium text-cinematic-900 dark:text-white">
                        Modify Shipping Information
                    </h2>
                    <p className="mt-1 text-sm text-cinematic-600 dark:text-cinematic-400">
                        Update your shipping information below.
                    </p>
                    
                    <div className="mt-4 space-y-4">
                        <div>
                            <InputLabel htmlFor="address" value="Address" />
                            <TextInput
                                id="address"
                                value={modifyData.address}
                                onChange={(e) => setModifyData('address', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="city" value="City" />
                            <TextInput
                                id="city"
                                value={modifyData.city}
                                onChange={(e) => setModifyData('city', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="state" value="State/Region" />
                            <TextInput
                                id="state"
                                value={modifyData.state}
                                onChange={(e) => setModifyData('state', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="postal_code" value="Postal Code" />
                            <TextInput
                                id="postal_code"
                                value={modifyData.postal_code}
                                onChange={(e) => setModifyData('postal_code', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="country" value="Country" />
                            <TextInput
                                id="country"
                                value={modifyData.country}
                                onChange={(e) => setModifyData('country', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput
                                id="phone"
                                value={modifyData.phone}
                                onChange={(e) => setModifyData('phone', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="notes" value="Additional Notes" />
                            <TextArea
                                id="notes"
                                value={modifyData.notes}
                                onChange={(e) => setModifyData('notes', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowModifyModal(false)}>
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton className="ml-3" disabled={modifyProcessing}>
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </CinematicLayout>
    );
}
