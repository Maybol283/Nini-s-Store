<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'created_at' => $order->created_at->format('M d, Y'),
                    'items_count' => $order->items->count(),
                    'first_item' => $order->items->first() ? [
                        'product_name' => $order->items->first()->product_name,
                        'image' => $order->items->first()->product ?
                            $order->items->first()->product->images[0]['imageSrc'] ?? '/images/placeholder.png' :
                            '/images/placeholder.png',
                    ] : null
                ];
            });

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display the specified order details.
     */
    public function show($id)
    {
        $user = Auth::user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with('items.product')
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at->format('M d, Y'),
                'shipping' => [
                    'name' => $order->shipping_name,
                    'email' => $order->shipping_email,
                    'address_line1' => $order->shipping_address_line1,
                    'address_line2' => $order->shipping_address_line2,
                    'city' => $order->shipping_city,
                    'postal_code' => $order->shipping_postal_code,
                    'country' => $order->shipping_country,
                ],
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'price' => $item->price,
                        'quantity' => $item->quantity,
                        'size' => $item->size,
                        'image' => $item->product ?
                            $item->product->images[0]['imageSrc'] ?? '/images/placeholder.png' :
                            '/images/placeholder.png',
                    ];
                })
            ],
            'success' => session('success'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : (object)[],
        ]);
    }

    /**
     * Update the order status to the next stage in the workflow.
     */
    public function updateStatus($id)
    {
        $user = Auth::user();

        // Only allow admin users to update order status
        if (!$user || $user->role !== 'admin') {
            return redirect()->back()->with('error', 'You do not have permission to update order status.');
        }

        $order = Order::findOrFail($id);

        // Define the status flow
        $statusFlow = [
            'pending' => 'processing',
            'processing' => 'shipped',
            'shipped' => 'delivered',
        ];

        $currentStatus = strtolower($order->status);

        // Check if the current status can be progressed
        if (array_key_exists($currentStatus, $statusFlow)) {
            $order->status = $statusFlow[$currentStatus];
            $order->save();

            return redirect()->back()->with('success', 'Order status updated successfully.');
        }

        return redirect()->back()->with('error', 'Order status cannot be updated further.');
    }
}
