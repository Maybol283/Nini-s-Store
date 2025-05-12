<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailable;

class OrderCompleted extends Mailable
{
    use Queueable, SerializesModels;



    /**
     * Create a new message instance.
     */
    public function __construct(
        public Order $order,
    ) {}


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Completed - Nini\'s Store',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.completed',
            with: [
                'orderStatus' => $this->order->status,
                'orderName' => $this->order->shipping_name,
                'orderEmail' => $this->order->shipping_email,
                'shippingAddress' => [
                    'line1' => $this->order->shipping_address_line1,
                    'line2' => $this->order->shipping_address_line2,
                    'city' => $this->order->shipping_city,
                    'state' => $this->order->shipping_state,
                    'postal_code' => $this->order->shipping_postal_code,
                    'country' => $this->order->shipping_country,
                ],
                'orderItems' => $this->order->items->map(function ($item) {
                    return [
                        'name' => $item->product_name,
                        'size' => $item->size,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                    ];
                }),
                'totalAmount' => $this->order->total_amount / 100,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
