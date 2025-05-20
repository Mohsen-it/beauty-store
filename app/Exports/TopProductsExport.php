<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class TopProductsExport implements FromArray, WithHeadings, WithTitle
{
    protected $productsData;

    public function __construct($productsData)
    {
        $this->productsData = $productsData;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $rows = [];
        
        foreach ($this->productsData as $index => $product) {
            $rows[] = [
                $index + 1,
                $product['name'],
                $product['sku'] ?? 'N/A',
                $product['category'],
                $product['quantity'],
                $product['revenue'],
                $product['average_price'],
            ];
        }
        
        return $rows;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Rank',
            'Product',
            'SKU',
            'Category',
            'Units Sold',
            'Revenue',
            'Average Price',
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Top Products Report';
    }
}
