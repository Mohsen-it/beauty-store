<?php
// Test file to check product images

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "<h1>Product Images Test</h1>";

// Get a product with images
$product = Product::with('images')->whereHas('images')->first();

if (!$product) {
    echo "<p style='color: red;'>No product with images found!</p>";
    exit;
}

echo "<h2>Product: {$product->name}</h2>";
echo "<p>ID: {$product->id}</p>";

// Display product image if exists
if ($product->image) {
    echo "<h3>Main Product Image:</h3>";
    echo "<p>Image path: {$product->image}</p>";
    echo "<p>Image URL: {$product->image_url}</p>";
    echo "<img src='{$product->image_url}' style='max-width: 300px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Image failed to load'; this.style.border='1px solid red';\">";
}

// Display product images
echo "<h3>Product Images:</h3>";
echo "<p>Number of images: " . count($product->images) . "</p>";

if (count($product->images) > 0) {
    echo "<div style='display: flex; flex-wrap: wrap; gap: 20px;'>";
    
    foreach ($product->images as $index => $image) {
        echo "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;'>";
        echo "<p>Image #{$index + 1}</p>";
        echo "<p>URL in DB: {$image->url}</p>";
        echo "<p>Image URL accessor: {$image->image_url}</p>";
        
        // Test different URL formats
        $directUrl = "/storage/{$image->url}";
        $accessorUrl = $image->image_url;
        
        echo "<div style='display: flex; gap: 10px;'>";
        
        // Test direct URL
        echo "<div>";
        echo "<p>Direct URL:</p>";
        echo "<img src='{$directUrl}' style='max-width: 150px; max-height: 150px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Image failed to load'; this.style.border='1px solid red';\">";
        echo "</div>";
        
        // Test accessor URL
        echo "<div>";
        echo "<p>Accessor URL:</p>";
        echo "<img src='{$accessorUrl}' style='max-width: 150px; max-height: 150px; border: 1px solid #ccc;' onerror=\"this.onerror=null; this.src=''; this.alt='Image failed to load'; this.style.border='1px solid red';\">";
        echo "</div>";
        
        echo "</div>";
        echo "</div>";
    }
    
    echo "</div>";
} else {
    echo "<p>No images found for this product.</p>";
}

// Test image URLs array
echo "<h3>Image URLs Array:</h3>";
$imageUrls = $product->image_urls;
echo "<pre>" . print_r($imageUrls, true) . "</pre>";

// Check raw database values
echo "<h3>Raw Database Values:</h3>";
$rawImages = DB::table('product_images')->where('product_id', $product->id)->get();
echo "<pre>" . print_r($rawImages, true) . "</pre>";
