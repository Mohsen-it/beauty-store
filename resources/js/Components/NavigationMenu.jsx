import React from 'react';
import NavLink from '@/Components/NavLink';
import { t } from '@/utils/translate';

const NavigationMenu = ({ auth, className = '' }) => {
  return (
    <nav className={`hidden lg:flex lg:space-x-2 xl:space-x-4 ${className}`}>
      <NavLink href={route('home')} current={route().current('home')}>
        {t('navigation.home')}
      </NavLink>
      <NavLink href={route('products.index')} current={route().current('products.index')}>
        {t('navigation.products')}
      </NavLink>
      <NavLink href={route('categories.skincare')} current={route().current('categories.skincare')}>
        Skincare
      </NavLink>
      <NavLink href={route('categories.makeup')} current={route().current('categories.makeup')}>
        Makeup
      </NavLink>
      {auth.user && (
        <NavLink href={route('orders.index')} current={route().current('orders.index')}>
          {t('navigation.orders')}
        </NavLink>
      )}
    </nav>
  );
};

export default NavigationMenu;
