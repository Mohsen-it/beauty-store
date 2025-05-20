<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Skincare Products (Category ID: 1)
            [
                'name' => 'Hydrating Facial Cleanser',
                'description' => 'A gentle, hydrating cleanser that removes impurities without stripping the skin of its natural moisture. Suitable for all skin types, especially dry and sensitive skin.',
                'price' => 24.99,
                'sale_price' => null,
                'stock' => 100,
              
                'category_id' => 1,
                'featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Vitamin C Brightening Serum',
                'description' => 'This powerful serum is formulated with 15% Vitamin C to brighten skin, reduce dark spots, and protect against environmental damage. Use daily for a more radiant complexion.',
                'price' => 49.99,
                'sale_price' => 39.99,
                'stock' => 75,
            
                'category_id' => 1,
                'featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Hyaluronic Acid Moisturizer',
                'description' => 'Deeply hydrating moisturizer with hyaluronic acid that locks in moisture for up to 24 hours. Perfect for dehydrated skin that needs intense hydration.',
                'price' => 38.50,
                'sale_price' => null,
                'stock' => 120,
                
                
                'category_id' => 1,
                'featured' => false,
                'is_active' => true,
            ],

            // Makeup Products (Category ID: 2)
            [
                'name' => 'Long-Lasting Matte Foundation',
                'description' => 'A lightweight, buildable foundation that provides full coverage with a natural matte finish. Available in 30 shades to match every skin tone.',
                'price' => 32.00,
                'sale_price' => null,
                'stock' => 150,
            
                'category_id' => 2,
                'featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Volumizing Mascara',
                'description' => 'This mascara adds dramatic volume and length to your lashes without clumping. The unique brush separates and coats each lash for a bold, eye-opening effect.',
                'price' => 22.50,
                'sale_price' => 18.99,
                'stock' => 200,
                
                
                'category_id' => 2,
                'featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Nude Eyeshadow Palette',
                'description' => 'A versatile palette featuring 12 highly-pigmented nude shades in matte and shimmer finishes. Perfect for creating everyday looks or dramatic evening styles.',
                'price' => 45.00,
                'sale_price' => null,
                'stock' => 85,
              
                'category_id' => 2,
                'featured' => true,
                'is_active' => true,
            ],

            // Haircare Products (Category ID: 3)
            [
                'name' => 'Repairing Hair Mask',
                'description' => 'This intensive treatment repairs damaged hair, restores moisture, and adds shine. Use weekly for healthier, more manageable hair.',
                'price' => 28.00,
                'sale_price' => null,
                'stock' => 90,
                
                
                'category_id' => 3,
                'featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Volumizing Shampoo',
                'description' => 'Adds body and volume to fine, limp hair without weighing it down. Gentle enough for daily use and color-treated hair.',
                'price' => 18.99,
                'sale_price' => 15.99,
                'stock' => 120,
                
                
                'category_id' => 3,
                'featured' => true,
                'is_active' => true,
            ],

            // Fragrance Products (Category ID: 4)
            [
                'name' => 'Floral Eau de Parfum',
                'description' => 'A sophisticated floral fragrance with notes of rose, jasmine, and vanilla. Long-lasting and perfect for everyday wear.',
                'price' => 65.00,
                'sale_price' => 55.00,
                'stock' => 50,
             
                'category_id' => 4,
                'featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Woody Cologne for Men',
                'description' => 'A masculine fragrance with woody and spicy notes. Perfect for evening wear and special occasions.',
                'price' => 70.00,
                'sale_price' => null,
                'stock' => 45,
                
                
                'category_id' => 4,
                'featured' => false,
                'is_active' => true,
            ],

            // Bath & Body Products (Category ID: 5)
            [
                'name' => 'Lavender Body Scrub',
                'description' => 'Exfoliating body scrub with lavender essential oil to smooth skin and promote relaxation. Made with natural ingredients.',
                'price' => 22.00,
                'sale_price' => null,
                'stock' => 80,
                
                
                'category_id' => 5,
                'featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Moisturizing Body Lotion',
                'description' => 'Rich, fast-absorbing body lotion that hydrates skin for 24 hours. Leaves skin feeling soft and smooth without greasiness.',
                'price' => 19.99,
                'sale_price' => 16.99,
                'stock' => 100,
                
                
                'category_id' => 5,
                'featured' => true,
                'is_active' => true,
            ],

            // Tools & Accessories (Category ID: 6)
            [
                'name' => 'Makeup Brush Set',
                'description' => 'Complete set of 12 professional makeup brushes for face and eyes. Soft, synthetic bristles and ergonomic handles.',
                'price' => 35.00,
                'sale_price' => 29.99,
                'stock' => 60,
                
                
                'category_id' => 6,
                'featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Jade Facial Roller',
                'description' => 'Natural jade roller that helps reduce puffiness, improve circulation, and enhance product absorption. Use morning and night for best results.',
                'price' => 25.00,
                'sale_price' => null,
                'stock' => 70,
                'category_id' => 6,
                'featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => $product['description'],
                'price' => $product['price'],
                'sale_price' => $product['sale_price'],
                'stock' => $product['stock'],
                'category_id' => $product['category_id'],
                'featured' => $product['featured'],
                'is_active' => $product['is_active'],
            ]);
        }
    }
}
