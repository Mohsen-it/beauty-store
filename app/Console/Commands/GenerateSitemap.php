<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.xml file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        // Start XML
        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Add static pages
        $sitemap .= $this->addUrl(URL::to('/'), '1.0', 'daily');
        $sitemap .= $this->addUrl(URL::to('/products'), '0.9', 'daily');
        $sitemap .= $this->addUrl(URL::to('/categories/skincare'), '0.8', 'weekly');
        $sitemap .= $this->addUrl(URL::to('/categories/makeup'), '0.8', 'weekly');
        $sitemap .= $this->addUrl(URL::to('/login'), '0.5', 'monthly');
        $sitemap .= $this->addUrl(URL::to('/register'), '0.5', 'monthly');

        // Add dynamic product pages
        try {
            $products = DB::table('products')->select('id', 'slug', 'updated_at')->get();
            
            foreach ($products as $product) {
                $lastmod = $product->updated_at ? date('Y-m-d', strtotime($product->updated_at)) : null;
                $sitemap .= $this->addUrl(
                    URL::to('/products/' . $product->slug),
                    '0.7',
                    'weekly',
                    $lastmod
                );
            }
        } catch (\Exception $e) {
            $this->error('Error fetching products: ' . $e->getMessage());
        }

        // Add dynamic category pages
        try {
            $categories = DB::table('categories')->select('id', 'slug', 'updated_at')->get();
            
            foreach ($categories as $category) {
                $lastmod = $category->updated_at ? date('Y-m-d', strtotime($category->updated_at)) : null;
                $sitemap .= $this->addUrl(
                    URL::to('/categories/' . $category->slug),
                    '0.8',
                    'weekly',
                    $lastmod
                );
            }
        } catch (\Exception $e) {
            $this->error('Error fetching categories: ' . $e->getMessage());
        }

        // Close XML
        $sitemap .= '</urlset>';

        // Save the sitemap
        File::put(public_path('sitemap.xml'), $sitemap);

        $this->info('Sitemap generated successfully!');
    }

    /**
     * Add a URL to the sitemap.
     *
     * @param string $url
     * @param string $priority
     * @param string $changefreq
     * @param string|null $lastmod
     * @return string
     */
    protected function addUrl($url, $priority, $changefreq, $lastmod = null)
    {
        $url = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
        
        $xml = "    <url>" . PHP_EOL;
        $xml .= "        <loc>{$url}</loc>" . PHP_EOL;
        
        if ($lastmod) {
            $xml .= "        <lastmod>{$lastmod}</lastmod>" . PHP_EOL;
        }
        
        $xml .= "        <changefreq>{$changefreq}</changefreq>" . PHP_EOL;
        $xml .= "        <priority>{$priority}</priority>" . PHP_EOL;
        $xml .= "    </url>" . PHP_EOL;
        
        return $xml;
    }
}
