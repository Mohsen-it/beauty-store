#!/bin/bash

# Bash script to optimize images for web
# Requires: npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg imagemin-webp

echo "Starting image optimization..."

# Create directories for optimized images if they don't exist
mkdir -p public/images/optimized
mkdir -p public/images/webp

# Optimize JPG images
echo "Optimizing JPG images..."
imagemin "public/images/*.jpg" --out-dir="public/images/optimized" --plugin=mozjpeg

# Optimize PNG images
echo "Optimizing PNG images..."
imagemin "public/images/*.png" --out-dir="public/images/optimized" --plugin=pngquant

# Convert images to WebP format
echo "Converting images to WebP format..."
imagemin "public/images/*.{jpg,png}" --out-dir="public/images/webp" --plugin=webp

echo "Image optimization complete!"
echo "Optimized images are in public/images/optimized and public/images/webp"
