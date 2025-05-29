import React, { memo, useMemo } from 'react';
import NavLink from '@/Components/NavLink';
import { t } from '@/utils/translate';

const NavigationMenu = memo(({ auth, className = '' }) => {
  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    {
      href: route('home'),
      current: route().current('home'),
      label: t('navigation.home'),
      key: 'home'
    },
    {
      href: route('products.index'),
      current: route().current('products.index'),
      label: t('navigation.products'),
      key: 'products'
    },
    {
      href: route('categories.skincare'),
      current: route().current('categories.skincare'),
      label: t('navigation.skincare'),
      key: 'skincare'
    },
    {
      href: route('categories.makeup'),
      current: route().current('categories.makeup'),
      label: t('navigation.makeup'),
      key: 'makeup'
    }
  ], []);

  // Memoize user-specific navigation items
  const userNavigationItems = useMemo(() => {
    if (!auth.user) return [];

    return [
      {
        href: route('orders.index'),
        current: route().current('orders.index'),
        label: t('navigation.orders'),
        key: 'orders'
      }
    ];
  }, [auth.user]);

  // Memoize combined navigation items
  const allNavigationItems = useMemo(() => [
    ...navigationItems,
    ...userNavigationItems
  ], [navigationItems, userNavigationItems]);

  return (
    <nav className={`hidden lg:flex lg:space-x-2 xl:space-x-4 nav-item ${className}`}>
      {allNavigationItems.map((item) => (
        <NavLink
          key={item.key}
          href={item.href}
          active={item.current}
          className="nav-item"
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
