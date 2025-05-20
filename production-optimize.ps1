# Production Optimization Script for Laravel (PowerShell version)
Write-Host "Starting Laravel production optimization..." -ForegroundColor Green

# Clear all caches first
Write-Host "Clearing existing caches..." -ForegroundColor Yellow
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize class autoloader
Write-Host "Optimizing Composer autoloader..." -ForegroundColor Yellow
composer install --optimize-autoloader --no-dev

# Cache configuration
Write-Host "Caching configuration..." -ForegroundColor Yellow
php artisan config:cache

# Cache routes
Write-Host "Caching routes..." -ForegroundColor Yellow
php artisan route:cache

# Cache views
Write-Host "Caching views..." -ForegroundColor Yellow
php artisan view:cache

# Run general optimization
Write-Host "Running general optimization..." -ForegroundColor Yellow
php artisan optimize

# Clear and cache event listeners
Write-Host "Caching event listeners..." -ForegroundColor Yellow
php artisan event:cache

# Generate storage link if needed
Write-Host "Ensuring storage link exists..." -ForegroundColor Yellow
php artisan storage:link

Write-Host "Laravel optimization complete!" -ForegroundColor Green
