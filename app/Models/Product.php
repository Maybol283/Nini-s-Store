<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'image_url',
        'category',
        'age'
    ];

    protected $casts = [
        'price' => 'decimal:2'
    ];
}
