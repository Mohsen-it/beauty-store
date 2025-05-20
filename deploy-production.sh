#!/bin/bash

# Bash script for production deployment
# This script runs all necessary commands to prepare the application for production

echo "Starting production deployment process..."

# 1. Pull latest changes from repository
echo "Pulling latest changes from repository..."
git pull

# 2. Install PHP dependencies
echo "Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev

# 3. Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm ci

# 4. Build frontend assets
echo "Building frontend assets..."
npm run build

# 5. Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# 6. Generate sitemap
echo "Generating sitemap..."
php artisan sitemap:generate

# 7. Optimize images
echo "Optimizing images..."
bash ./optimize-images.sh

# 8. Run Laravel optimization commands
echo "Running Laravel optimization commands..."
bash ./production-optimize.sh

# 9. Clear all caches
echo "Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 10. Cache configuration, routes, and views
echo "Caching configuration, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 11. Run general optimization
echo "Running general optimization..."
php artisan optimize

# 12. Ensure storage link exists
echo "Ensuring storage link exists..."
php artisan storage:link

# 13. Run tests
echo "Running tests..."
php artisan test

echo "Production deployment process completed!"
echo "Please review the PRODUCTION-CHECKLIST.md file for additional steps."
