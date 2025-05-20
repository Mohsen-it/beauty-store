<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users except admin
        $users = User::where('is_admin', false)->get();
        
        // Get all products
        $products = Product::where('is_active', true)->get();
        
        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->info('No users or products found. Please run UserSeeder and ProductSeeder first.');
            return;
        }
        
        // Create 20 orders with random data
        for ($i = 0; $i < 20; $i++) {
            $user = $users->random();
            $orderDate = now()->subDays(rand(1, 30));
            
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'status' => $this->getRandomStatus(),
                'subtotal' => 0,
                'tax' => 0,
                'shipping' => 10.00,
                'total' => 0,
                'payment_method' => $this->getRandomPaymentMethod(),
                'payment_status' => 'pending',
                'first_name' => $user->name,
                'last_name' => 'Customer',
                'email' => $user->email,
                'phone' => $this->getRandomPhone(),
                'address' => $this->getRandomAddress(),
                'city' => $this->getRandomCity(),
                'state' => '',
                'postal_code' => rand(10000, 99999),
                'country' => 'United Arab Emirates',
                'notes' => rand(0, 1) ? $this->getRandomNote() : null,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);
            
            // Add 1-5 random products to the order
            $orderTotal = 0;
            $orderProducts = $products->random(rand(1, 5));
            
            foreach ($orderProducts as $product) {
                $quantity = rand(1, 3);
                $price = $product->sale_price ?? $product->price;
                $subtotal = $price * $quantity;
                $orderTotal += $subtotal;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                ]);
            }
            
            // Update order total
            $order->subtotal = $orderTotal;
            $order->tax = $orderTotal * 0.05;
            $order->total = $orderTotal + ($orderTotal * 0.05) + 10.00;
            $order->save();
        }
        
        $this->command->info('Orders have been created successfully!');
    }
    
    /**
     * Get a random order status.
     */
    private function getRandomStatus(): string
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return $statuses[array_rand($statuses)];
    }
    
    /**
     * Get a random address.
     */
    private function getRandomAddress(): string
    {
        $addresses = [
            'Apartment 501, Tower A, Marina Heights',
            'Villa 23, Arabian Ranches',
            'Unit 1204, Burj Residences',
            'Flat 302, Al Fahidi Building, Bur Dubai',
            'House 15, Street 4, Al Barsha South',
            'Apartment 1103, Jumeirah Beach Residence',
            'Villa 42, Palm Jumeirah',
            'Suite 701, Business Bay Tower',
            'Apartment 805, Downtown Dubai',
            'Villa 37, Meadows Community'
        ];
        
        return $addresses[array_rand($addresses)];
    }
    
    /**
     * Get a random city.
     */
    private function getRandomCity(): string
    {
        $cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
        return $cities[array_rand($cities)];
    }
    
    /**
     * Get a random phone number.
     */
    private function getRandomPhone(): string
    {
        return '+971 5' . rand(0, 9) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999);
    }
    
    /**
     * Get a random payment method.
     */
    private function getRandomPaymentMethod(): string
    {
        $methods = ['credit_card', 'debit_card', 'cash_on_delivery', 'bank_transfer'];
        return $methods[array_rand($methods)];
    }
    
    /**
     * Get a random note.
     */
    private function getRandomNote(): string
    {
        $notes = [
            'Please deliver in the evening',
            'Leave package at the reception',
            'Call before delivery',
            'Fragile items, handle with care',
            'Gift wrapping requested',
            'Please deliver on weekend',
            'Contact security before delivery',
            'No signature required',
            'Please deliver to back entrance',
            'Call if no one answers the door'
        ];
        
        return $notes[array_rand($notes)];
    }
}
