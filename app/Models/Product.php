<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'stock',
        // 'image', // Original single image field, potentially deprecated by ProductImage relationship
        // 'gallery', // Original gallery field, potentially deprecated by ProductImage relationship
        'category_id',
        'featured',
        'is_active',
    ];

    protected $casts = [
        // 'gallery' => 'array', // If using ProductImage, this might be deprecated
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Appends 'is_liked' and 'image_urls' to the model's array and JSON representations.
    protected $appends = ['is_liked', 'image_urls'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'product_likes', 'product_id', 'user_id')
            ->withTimestamps();
    }

    public function likes(): HasMany
    {
        return $this->hasMany(ProductLike::class);
    }

    /**
     * Get all of the product's images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Accessor to get an array of image URLs.
     * These URLs are full URLs to the images.
     */
    public function getImageUrlsAttribute(): array
    {
        return $this->images->pluck('image_url')->toArray();
    }

    /**
     * Accessor to get the full URL of the product image.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return url('storage/' . $this->image);
    }

    public function getIsLikedAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }
        return $this->likes()->where('user_id', Auth::id())->exists();
    }
}

