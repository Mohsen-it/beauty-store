// SSR entry point for Inertia
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import route from '../../vendor/tightenco/ziggy/dist/index.m';

// Import CSS
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'Cosmetics Store';

// Cache for component instances
const COMPONENT_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Function to check if component is SSR-sensitive
const isSSRSensitive = (name) => {
  return name.includes('Admin/') || 
         name.includes('Cart') || 
         name.includes('Checkout') || 
         name.includes('Orders');
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: async (name) => {
            // Skip cache for sensitive pages
            if (isSSRSensitive(name)) {
                const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
                return resolvePageComponent(`./Pages/${name}.jsx`, pages);
            }

            // Check if component exists in cache and is not expired
            const cacheKey = `component_${name}`;
            const cachedComponent = COMPONENT_CACHE.get(cacheKey);
            
            if (cachedComponent && (Date.now() - cachedComponent.timestamp) < CACHE_TTL) {
                return cachedComponent.component;
            }
            
            // If not in cache, resolve and cache it
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
            const component = await resolvePageComponent(`./Pages/${name}.jsx`, pages);
            
            // Store in cache
            COMPONENT_CACHE.set(cacheKey, {
                component,
                timestamp: Date.now()
            });
            
            return component;
        },
        setup: ({ App, props }) => {
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return <App {...props} />;
        },
    })
);
