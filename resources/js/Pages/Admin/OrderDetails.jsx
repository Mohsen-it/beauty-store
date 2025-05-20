import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const OrderDetails = ({ order }) => {
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "pending"
  );
  const [sendNotification, setSendNotification] = useState(true);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value);
  };

  const updateStatus = () => {
    // In a real app, this would make an API call to update the order status
    console.log(
      `Update order ${order.id} status to ${currentStatus} with notification: ${sendNotification}`
    );
    // Inertia.put(route('admin.orders.update-status', order.id), {
    //   status: currentStatus,
    //   send_notification: sendNotification
    // });
  };

  const printInvoice = () => {
    // In a real app, this would open a printable invoice
    console.log(`Print invoice for order ${order.id}`);
    // window.open(route('admin.orders.invoice', order.id), '_blank');
  };

  const printPackingSlip = () => {
    // In a real app, this would open a printable packing slip
    console.log(`Print packing slip for order ${order.id}`);
    // window.open(route('admin.orders.packing-slip', order.id), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Order #{order.id}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div>
            {statusOptions.map(
              (option) =>
                option.value === order.status && (
                  <span
                    key={option.value}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}
                  >
                    {option.label}
                  </span>
                )
            )}
          </div>
        </div>

        {/* Order Actions */}
        <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
          <div className="flex-grow">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Update Status
            </label>
            <div className="flex items-center space-x-2">
              <select
                id="status"
                className="form-input py-1 text-sm"
                value={currentStatus}
                onChange={handleStatusChange}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center">
                <input
                  id="send_notification"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  checked={sendNotification}
                  onChange={() => setSendNotification(!sendNotification)}
                />
                <label
                  htmlFor="send_notification"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Notify Customer
                </label>
              </div>
              <button
                type="button"
                onClick={updateStatus}
                className="btn btn-primary btn-sm"
              >
                Update
              </button>
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="button"
              onClick={printInvoice}
              className="btn btn-secondary btn-sm"
            >
              Print Invoice
            </button>
            <button
              type="button"
              onClick={printPackingSlip}
              className="btn btn-secondary btn-sm"
            >
              Print Packing Slip
            </button>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-900">
              Customer Information
            </h3>
          </div>
          <div className="px-6 py-4">
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            {order.customer.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Customer Notes:
                </p>
                <p className="text-sm text-gray-600">{order.customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-900">
              Shipping Address
            </h3>
          </div>
          <div className="px-6 py-4">
            <p className="font-medium">{order.shipping_address.name}</p>
            <p className="text-gray-600">
              {order.shipping_address.address_line1}
            </p>
            {order.shipping_address.address_line2 && (
              <p className="text-gray-600">
                {order.shipping_address.address_line2}
              </p>
            )}
            <p className="text-gray-600">
              {order.shipping_address.city}, {order.shipping_address.state}{" "}
              {order.shipping_address.postal_code}
            </p>
            <p className="text-gray-600">{order.shipping_address.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-md font-medium text-gray-900">Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                        <img
                          src={
                            item.product.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={item.product.name}
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                        {item.options &&
                          Object.keys(item.options).length > 0 && (
                            <div className="text-sm text-gray-500">
                              {Object.entries(item.options)
                                .map(([key, value]) => (
                                  <span key={key}>
                                    {key}: {value}
                                  </span>
                                ))
                                .join(", ")}
                            </div>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                >
                  Subtotal
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  ${order.subtotal.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                >
                  Shipping
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  ${order.shipping.toFixed(2)}
                </td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                  >
                    Discount
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-text-green-600">
                    -${order.discount.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                >
                  Tax
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  ${order.tax.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-3 text-right text-sm font-bold text-gray-900"
                >
                  Total
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-md font-medium text-gray-900">
            Payment Information
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Payment Method:
              </p>
              <p className="text-sm text-gray-600">{order.payment.method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Payment Status:
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.payment.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {order.payment.status.charAt(0).toUpperCase() +
                  order.payment.status.slice(1)}
              </span>
            </div>
            {order.payment.transaction_id && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Transaction ID:
                </p>
                <p className="text-sm text-gray-600">
                  {order.payment.transaction_id}
                </p>
              </div>
            )}
            {order.payment.date && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Payment Date:
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(order.payment.date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-md font-medium text-gray-900">Order History</h3>
        </div>
        <div className="px-6 py-4">
          <ul className="space-y-4">
            {order.history.map((event, index) => (
              <li key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      event.type === "status_change"
                        ? "bg-blue-100 text-blue-600"
                        : event.type === "payment"
                          ? "bg-green-100 text-green-600"
                          : event.type === "note"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {event.type === "status_change" && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    )}
                    {event.type === "payment" && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    )}
                    {event.type === "note" && (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString()} at{" "}
                    {new Date(event.timestamp).toLocaleTimeString()} by{" "}
                    {event.user}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
