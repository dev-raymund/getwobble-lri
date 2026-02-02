<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'regular_price',
        'sale_price',
        'stock',
        'sku',
        'tax_status',
        'tax_class',
        'image',
        'is_active',
        'author_id',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the product.
     */
    public function author(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'author_id');
    }

    /**
     * Get the product's categories
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_has_categories');
    }

    /**
     * Get the product's gallery images
     */
    public function gallery()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
}
