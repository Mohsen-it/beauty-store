import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig(({ command, mode }) => {
    const isProduction = command === 'build';
    const isProdMode = mode === 'production';

    return {
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: !isProduction,
                ssr: 'resources/js/ssr.jsx',
            }),
            react(),
            splitVendorChunkPlugin(),
        ],
        server: {
            host: '127.0.0.1', // Use 127.0.0.1 instead of 0.0.0.0
            port: 5173,
            hmr: {
                host: '127.0.0.1',
                protocol: 'ws',
                port: 5173,
            },
            watch: {
                usePolling: true, // Keep this if working in docker or WSL
            },
        },
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
        build: {
            // Enhanced production optimization settings
            target: 'es2015',
            cssCodeSplit: true,
            minify: 'terser',
            sourcemap: !isProdMode, // Only generate sourcemaps in development
            modulePreload: {
                polyfill: false, // Disable module preload polyfill to reduce preloading
            },
            terserOptions: {
                compress: {
                    drop_console: isProdMode,
                    drop_debugger: isProdMode,
                    pure_funcs: isProdMode ? ['console.log', 'console.debug', 'console.info'] : [],
                },
                format: {
                    comments: false, // Remove comments
                },
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: [
                            'react',
                            'react-dom',
                            '@inertiajs/react'
                        ],
                        chart: ['chart.js', 'react-chartjs-2'],
                        motion: ['framer-motion'],
                        stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
                        utils: ['date-fns', 'lodash']
                    },
                    // Ensure chunk filenames include content hash for better caching
                    chunkFileNames: isProdMode ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
                    entryFileNames: isProdMode ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
                    assetFileNames: isProdMode ? 'assets/[ext]/[name].[hash].[ext]' : 'assets/[ext]/[name].[ext]',
                },
                // Reduce preloading by being more selective
                external: (id) => {
                    // Don't preload certain CSS files
                    if (id.includes('category-circles.css') ||
                        id.includes('product-page.css') ||
                        id.includes('animations.css')) {
                        return false;
                    }
                    return false;
                }
            },
            chunkSizeWarningLimit: 1000,
        },
        optimizeDeps: {
            include: [
                '@inertiajs/react',
                'chart.js',
                'react-chartjs-2',
                'framer-motion',
                'lodash',
                'react-hot-toast'
            ],
        },
    };
});