<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds to populate product_images table from existing gallery data.
     */
    public function run(): void
    {
        // Clear existing product images to avoid duplicates
        DB::table('product_images')->truncate();
        
        // Get all products
        $products = Product::all();
        
        foreach ($products as $product) {
            // Add main product image as the first image
            if ($product->image) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $product->image,
                    'order' => 0,
                ]);
            }
            
            // Process gallery images if they exist
            if ($product->gallery) {
                $galleryArray = [];
                
                // Parse gallery if it's a JSON string
                if (is_string($product->gallery)) {
                    try {
                        $galleryArray = json_decode($product->gallery, true);
                    } catch (\Exception $e) {
                        // Skip if JSON parsing fails
                        continue;
                    }
                } 
                // Use directly if it's already an array
                elseif (is_array($product->gallery)) {
                    $galleryArray = $product->gallery;
                }
                
                // Add each gallery image to product_images table
                if (is_array($galleryArray)) {
                    foreach ($galleryArray as $index => $imageUrl) {
                        if (!empty($imageUrl)) {
                            ProductImage::create([
                                'product_id' => $product->id,
                                'url' => $imageUrl,
                                'order' => $index + 1, // Start from 1 since main image is 0
                            ]);
                        }
                    }
                }
            }
        }
        
        $this->command->info('Product images have been populated from gallery data!');
    }
}
