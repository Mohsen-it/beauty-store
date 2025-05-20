<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class SalesExport implements FromArray, WithHeadings, WithTitle
{
    protected $salesData;

    public function __construct($salesData)
    {
        $this->salesData = $salesData;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $rows = [];
        
        foreach ($this->salesData['details'] as $detail) {
            $rows[] = [
                $detail['date'],
                $detail['orders'],
                $detail['items'],
                $detail['revenue'],
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
            'Date',
            'Orders',
            'Items Sold',
            'Revenue',
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Sales Report';
    }
}
