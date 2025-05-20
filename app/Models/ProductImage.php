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
        if (!$value) {
            return null;
        }

        if (Str::startsWith($value, 'http://') || Str::startsWith($value, 'https://')) {
            return $value;
        }

        // Store the original value without modification
        return $value;
    }

    /**
     * Get the full URL for the image.
     *
     * @return string
     */
    public function getImageUrlAttribute()
    {
        if (!$this->url) {
            return null;
        }

        if (Str::startsWith($this->url, 'http://') || Str::startsWith($this->url, 'https://')) {
            return $this->url;
        }

        // Ensure we're using the correct path format for storage URLs
        // Remove any leading slashes to avoid double slashes in the URL
        $cleanPath = ltrim($this->url, '/');

        // Make sure we don't add 'storage/' twice if it's already in the path
        if (Str::startsWith($cleanPath, 'storage/')) {
            return url($cleanPath);
        }

        return url('storage/' . $cleanPath);
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
