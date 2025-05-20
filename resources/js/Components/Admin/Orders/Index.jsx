import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import OrderDetails from '@/Components/Admin/OrderDetails';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-pink-600">
                  Cosmetics Store
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={route('admin.dashboard')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={route('admin.products.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href={route('admin.categories.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href={route('admin.orders.index')}
                  className="border-pink-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href={route('home')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Store
              </Link>
              <div className="ml-3 relative">
                <Link
                  href={route('profile.edit')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const OrderList = ({ orders }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Sample orders data if none provided
  const sampleOrders = [
    {
      id: 1001,
      customer: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 123-4567',
        notes: 'Please leave package at the front door'
      },
      status: 'delivered',
      total: 129.99,
      items_count: 3,
      created_at: '2025-04-10T14:30:00Z',
      shipping_address: {
        name: 'Jane Smith',
        address_line1: '123 Main St',
        address_line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'United States'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid',
        transaction_id: 'txn_1234567890',
        date: '2025-04-10T14:35:00Z'
      },
      subtotal: 119.99,
      shipping: 5.00,
      tax: 5.00,
      discount: 0,
      total: 129.99,
      items: [
        {
          id: 1,
          product: {
            name: 'Hydrating Face Cream',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 29.99,
          quantity: 1
        },
        {
          id: 2,
          product: {
            name: 'Volumizing Mascara',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 19.99,
          quantity: 2
        },
        {
          id: 3,
          product: {
            name: 'Nourishing Shampoo',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 15.99,
          quantity: 1
        }
      ],
      history: [
        {
          type: 'status_change',
          description: 'Order created',
          timestamp: '2025-04-10T14:30:00Z',
          user: 'System'
        },
        {
          type: 'payment',
          description: 'Payment received',
          timestamp: '2025-04-10T14:35:00Z',
          user: 'System'
        },
        {
          type: 'status_change',
          description: 'Order status changed from pending to processing',
          timestamp: '2025-04-10T15:00:00Z',
          user: 'Admin User'
        },
        {
          type: 'status_change',
          description: 'Order status changed from processing to shipped',
          timestamp: '2025-04-11T10:15:00Z',
          user: 'Admin User'
        },
        {
          type: 'note',
          description: 'Tracking number added: USPS12345678901234',
          timestamp: '2025-04-11T10:20:00Z',
          user: 'Admin User'
        },
        {
          type: 'status_change',
          description: 'Order status changed from shipped to delivered',
          timestamp: '2025-04-13T09:45:00Z',
          user: 'System'
        }
      ]
    },
    {
      id: 1002,
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 987-6543'
      },
      status: 'processing',
      total: 75.98,
      items_count: 2,
      created_at: '2025-04-12T10:15:00Z',
      shipping_address: {
        name: 'John Doe',
        address_line1: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postal_code: '90001',
        country: 'United States'
      },
      payment: {
        method: 'PayPal',
        status: 'paid',
        transaction_id: 'txn_0987654321',
        date: '2025-04-12T10:20:00Z'
      },
      subtotal: 69.98,
      shipping: 0,
      tax: 6.00,
      discount: 0,
      total: 75.98,
      items: [
        {
          id: 4,
          product: {
            name: 'Exfoliating Body Scrub',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 24.99,
          quantity: 1
        },
        {
          id: 5,
          product: {
            name: 'Floral Perfume',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 44.99,
          quantity: 1
        }
      ],
      history: [
        {
          type: 'status_change',
          description: 'Order created',
          timestamp: '2025-04-12T10:15:00Z',
          user: 'System'
        },
        {
          type: 'payment',
          description: 'Payment received',
          timestamp: '2025-04-12T10:20:00Z',
          user: 'System'
        },
        {
          type: 'status_change',
          description: 'Order status changed from pending to processing',
          timestamp: '2025-04-12T11:30:00Z',
          user: 'Admin User'
        }
      ]
    },
    {
      id: 1003,
      customer: {
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        phone: '(555) 456-7890'
      },
      status: 'pending',
      total: 49.99,
      items_count: 1,
      created_at: '2025-04-13T08:45:00Z',
      shipping_address: {
        name: 'Emily Johnson',
        address_line1: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        postal_code: '60601',
        country: 'United States'
      },
      payment: {
        method: 'Credit Card',
        status: 'pending',
        date: '2025-04-13T08:45:00Z'
      },
      subtotal: 44.99,
      shipping: 5.00,
      tax: 0,
      discount: 0,
      total: 49.99,
      items: [
        {
          id: 6,
          product: {
            name: 'Luxury Face Serum',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 44.99,
          quantity: 1
        }
      ],
      history: [
        {
          type: 'status_change',
          description: 'Order created',
          timestamp: '2025-04-13T08:45:00Z',
          user: 'System'
        }
      ]
    },
    {
      id: 1004,
      customer: {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '(555) 234-5678'
      },
      status: 'shipped',
      total: 89.97,
      items_count: 3,
      created_at: '2025-04-11T16:20:00Z',
      shipping_address: {
        name: 'Michael Brown',
        address_line1: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        postal_code: '77001',
        country: 'United States'
      },
      payment: {
        method: 'Credit Card',
        status: 'paid',
        transaction_id: 'txn_1122334455',
        date: '2025-04-11T16:25:00Z'
      },
      subtotal: 79.97,
      shipping: 5.00,
      tax: 5.00,
      discount: 0,
      total: 89.97,
      items: [
        {
          id: 7,
          product: {
            name: 'Anti-Aging Night Cream',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 39.99,
          quantity: 1
        },
        {
          id: 8,
          product: {
            name: 'Hydrating Lip Balm',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 9.99,
          quantity: 2
        },
        {
          id: 9,
          product: {
            name: 'Facial Cleansing Brush',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 20.00,
          quantity: 1
        }
      ],
      history: [
        {
          type: 'status_change',
          description: 'Order created',
          timestamp: '2025-04-11T16:20:00Z',
          user: 'System'
        },
        {
          type: 'payment',
          description: 'Payment received',
          timestamp: '2025-04-11T16:25:00Z',
          user: 'System'
        },
        {
          type: 'status_change',
          description: 'Order status changed from pending to processing',
          timestamp: '2025-04-12T09:00:00Z',
          user: 'Admin User'
        },
        {
          type: 'status_change',
          description: 'Order status changed from processing to shipped',
          timestamp: '2025-04-12T14:30:00Z',
          user: 'Admin User'
        },
        {
          type: 'note',
          description: 'Tracking number added: FEDEX9876543210',
          timestamp: '2025-04-12T14:35:00Z',
          user: 'Admin User'
        }
      ]
    },
    {
      id: 1005,
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '(555) 876-5432'
      },
      status: 'cancelled',
      total: 64.99,
      items_count: 2,
      created_at: '2025-04-09T11:10:00Z',
      shipping_address: {
        name: 'Sarah Wilson',
        address_line1: '555 Maple Ave',
        city: 'Miami',
        state: 'FL',
        postal_code: '33101',
        country: 'United States'
      },
      payment: {
        method: 'Credit Card',
        status: 'refunded',
        transaction_id: 'txn_5566778899',
        date: '2025-04-09T11:15:00Z'
      },
      subtotal: 59.99,
      shipping: 5.00,
      tax: 0,
      discount: 0,
      total: 64.99,
      items: [
        {
          id: 10,
          product: {
            name: 'Vitamin C Serum',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 34.99,
          quantity: 1
        },
        {
          id: 11,
          product: {
            name: 'Makeup Brush Set',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=580&q=80'
          },
          price: 25.00,
          quantity: 1
        }
      ],
      history: [
        {
          type: 'status_change',
          description: 'Order created',
          timestamp: '2025-04-09T11:10:00Z',
          user: 'System'
        },
        {
          type: 'payment',
          description: 'Payment received',
          timestamp: '2025-04-09T11:15:00Z',
          user: 'System'
        },
        {
          type: 'status_change',
          description: 'Order status changed from pending to processing',
          timestamp: '2025-04-09T14:00:00Z',
          user: 'Admin User'
        },
        {
          type: 'note',
          description: 'Customer requested cancellation via email',
          timestamp: '2025-04-10T09:30:00Z',
          user: 'Admin User'
        },
        {
          type: 'status_change',
          description: 'Order status changed from processing to cancelled',
          timestamp: '2025-04-10T10:00:00Z',
          user: 'Admin User'
        },
        {
          type: 'payment',
          description: 'Payment refunded',
          timestamp: '2025-04-10T10:15:00Z',
          user: 'Admin User'
        }
      ]
    }
  ];
  
  const displayOrders = orders || sampleOrders;
  
  // Filter orders based on search term, status, and date
  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) || 
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    let matchesDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      matchesDate = orderDate === dateFilter;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <Head title="Orders - Admin Dashboard" />
      
      {showDetails ? (
        <div>
          <div className="mb-6 flex items-center">
            <button
              onClick={closeDetails}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 ml-4">
              Order #{selectedOrder.id}
            </h1>
          </div>
          
          <OrderDetails order={selectedOrder} />
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-0 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage customer orders, update status, and process shipments.
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="search"
                      className="form-input pl-10"
                      placeholder="Search by order ID, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="sr-only">Status</label>
                  <select
                    id="status"
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="sr-only">Date</label>
                  <input
                    id="date"
                    type="date"
                    className="form-input"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Order List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items_count} item(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - simplified for demo */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-pink-50 border-pink-500 text-pink-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default OrderList;
