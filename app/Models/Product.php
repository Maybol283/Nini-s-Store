<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'age_group',
        'size',
        'images',
        'in_stock'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
        'in_stock' => 'boolean'
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function isAvailable(): bool
    {
        return $this->in_stock;
    }
}
