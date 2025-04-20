<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'total',
        'item_count'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'item_count' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function addItem(Product $product, int $quantity, string $size)
    {
        $existingItem = $this->items()
            ->where('product_id', $product->id)
            ->where('size', $size)
            ->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $quantity);
        } else {
            $this->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'size' => $size
            ]);
        }

        // Update cart totals
        $this->updateTotals();
    }

    public function removeItem(CartItem $item)
    {
        $item->delete();
        $this->updateTotals();
    }

    public function updateTotals()
    {
        $this->item_count = $this->items()->sum('quantity');
        $this->total = $this->items()
            ->join('products', 'cart_items.product_id', '=', 'products.id')
            ->selectRaw('SUM(cart_items.quantity * products.price) as total')
            ->value('total') ?? 0;
        $this->save();
    }

    public function clear()
    {
        $this->items()->delete();
        $this->updateTotals();
    }
}
