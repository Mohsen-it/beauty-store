# PowerShell script for production deployment
# This script runs all necessary commands to prepare the application for production

Write-Host "Starting production deployment process..." -ForegroundColor Green

# 1. Pull latest changes from repository
Write-Host "Pulling latest changes from repository..." -ForegroundColor Yellow
git pull

# 2. Install PHP dependencies
Write-Host "Installing PHP dependencies..." -ForegroundColor Yellow
composer install --optimize-autoloader --no-dev

# 3. Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm ci

# 4. Build frontend assets
Write-Host "Building frontend assets..." -ForegroundColor Yellow
npm run build

# 5. Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
php artisan migrate --force

# 6. Generate sitemap
Write-Host "Generating sitemap..." -ForegroundColor Yellow
php artisan sitemap:generate

# 7. Optimize images
Write-Host "Optimizing images..." -ForegroundColor Yellow
./optimize-images.ps1

# 8. Run Laravel optimization commands
Write-Host "Running Laravel optimization commands..." -ForegroundColor Yellow
./production-optimize.ps1

# 9. Clear all caches
Write-Host "Clearing all caches..." -ForegroundColor Yellow
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 10. Cache configuration, routes, and views
Write-Host "Caching configuration, routes, and views..." -ForegroundColor Yellow
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 11. Run general optimization
Write-Host "Running general optimization..." -ForegroundColor Yellow
php artisan optimize

# 12. Ensure storage link exists
Write-Host "Ensuring storage link exists..." -ForegroundColor Yellow
php artisan storage:link

# 13. Run tests
Write-Host "Running tests..." -ForegroundColor Yellow
php artisan test

Write-Host "Production deployment process completed!" -ForegroundColor Green
Write-Host "Please review the PRODUCTION-CHECKLIST.md file for additional steps." -ForegroundColor Green
