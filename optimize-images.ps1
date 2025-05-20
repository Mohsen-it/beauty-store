# PowerShell script to optimize images for web
# Requires: npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg imagemin-webp

Write-Host "Starting image optimization..." -ForegroundColor Green

# Create directories for optimized images if they don't exist
$directories = @(
    "public/images/optimized",
    "public/images/webp"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Optimize JPG images
Write-Host "Optimizing JPG images..." -ForegroundColor Yellow
imagemin "public/images/*.jpg" --out-dir="public/images/optimized" --plugin=mozjpeg

# Optimize PNG images
Write-Host "Optimizing PNG images..." -ForegroundColor Yellow
imagemin "public/images/*.png" --out-dir="public/images/optimized" --plugin=pngquant

# Convert images to WebP format
Write-Host "Converting images to WebP format..." -ForegroundColor Yellow
imagemin "public/images/*.{jpg,png}" --out-dir="public/images/webp" --plugin=webp

Write-Host "Image optimization complete!" -ForegroundColor Green
Write-Host "Optimized images are in public/images/optimized and public/images/webp" -ForegroundColor Green
