#!/bin/bash

# Production Optimization Script for Laravel
echo "Starting Laravel production optimization..."

# Clear all caches first
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize class autoloader
echo "Optimizing Composer autoloader..."
composer install --optimize-autoloader --no-dev

# Cache configuration
echo "Caching configuration..."
php artisan config:cache

# Cache routes
echo "Caching routes..."
php artisan route:cache

# Cache views
echo "Caching views..."
php artisan view:cache

# Run general optimization
echo "Running general optimization..."
php artisan optimize

# Clear and cache event listeners
echo "Caching event listeners..."
php artisan event:cache

# Generate storage link if needed
echo "Ensuring storage link exists..."
php artisan storage:link

echo "Laravel optimization complete!"
