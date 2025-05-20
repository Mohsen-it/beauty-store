<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class ProductImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'url',
        'order',
    ];

    /**
     * Get the full URL for the image.
     *
     * @return string
     */
    public function getUrlAttribute($value)
    {
        if (Str::startsWith($value, ['http://', 'https://'])) {
            return $value;
        }
    
        return asset('storage/' . ltrim($value, '/'));
    }
    

    /**
     * Get the product that owns the image.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
