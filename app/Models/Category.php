<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image', // This field will store the relative path to the image
        'is_active', // Corrected from 'is_active' to match existing schema/controller logic
        'parent_id',
        'order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     * Adding 'image_url' to be automatically appended.
     *
     * @var array
     */
    protected $appends = ['image_url'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
    
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
    
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Accessor to get the full URL of the category image.
     * Returns null if no image is set.
     * The frontend will prepend BASE_URL + 'storage/' as per requirements.
     */
    public function getImageUrlAttribute(): ?string
    {
        // The 'image' attribute already stores the relative path (e.g., categories/YYYY/MM/DD/filename.ext)
        // as saved by the CategoryController.
        return $this->image;
    }
}

