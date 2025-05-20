<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class TopCustomersExport implements FromArray, WithHeadings, WithTitle
{
    protected $customersData;

    public function __construct($customersData)
    {
        $this->customersData = $customersData;
    }

    /**
     * @return array
     */
    public function array(): array
    {
        $rows = [];
        
        foreach ($this->customersData as $index => $customer) {
            $rows[] = [
                $index + 1,
                $customer['name'],
                $customer['email'],
                $customer['orders_count'],
                $customer['total_spent'],
                $customer['average_order'],
                $customer['last_order_date'],
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
            'Customer Name',
            'Email',
            'Orders Count',
            'Total Spent',
            'Average Order Value',
            'Last Order Date',
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Top Customers Report';
    }
}
