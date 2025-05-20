<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Skincare',
                'description' => 'Premium skincare products for all skin types',
               
                'is_active' => true,
            ],
            [
                'name' => 'Makeup',
                'description' => 'High-quality makeup products for every occasion',
               
                'is_active' => true,
            ],
            [
                'name' => 'Haircare',
                'description' => 'Nourishing hair products for all hair types',
               
                'is_active' => true,
            ],
            [
                'name' => 'Fragrance',
                'description' => 'Luxurious fragrances for men and women',
               
                'is_active' => true,
            ],
            [
                'name' => 'Bath & Body',
                'description' => 'Pampering bath and body products for ultimate relaxation',
               
                'is_active' => true,
            ],
            [
                'name' => 'Tools & Accessories',
                'description' => 'Essential beauty tools and accessories',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                
                'is_active' => $category['is_active'],
            ]);
        }
    }
}
