<?php

namespace App\Services;

use App\Mail\OrderCompleted;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderMailerService
{
    /**
     * Send order completion email
     *
     * @param mixed $order
     * @return void
     */
    public function sendOrderCompletedEmail($order)
    {
        try {
            Mail::to($order->customer_email)
                ->send(new OrderCompleted($order));
        } catch (\Exception $e) {
            // Log the error but don't throw it to prevent breaking the order completion flow
            Log::error('Failed to send order completion email: ' . $e->getMessage());
        }
    }
}
