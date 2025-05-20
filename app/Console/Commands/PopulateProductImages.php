<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ProductImageSeeder;

class PopulateProductImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:populate-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate product_images table from existing gallery data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to populate product images...');
        
        // Call the seeder
        $seeder = new ProductImageSeeder();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('Product images have been successfully populated!');
        
        return Command::SUCCESS;
    }
}
