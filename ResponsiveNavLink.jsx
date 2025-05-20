import React from 'react';
import { Link } from '@inertiajs/react';

const ResponsiveNavLink = ({ href, active, children }) => {
  return (
    <Link
      href={href}
      className={`block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out ${
        active
          ? 'border-primary-400 text-primary-700 bg-primary-50 focus:outline-none focus:text-primary-800 focus:bg-primary-100 focus:border-primary-700'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
};

export default ResponsiveNavLink;
