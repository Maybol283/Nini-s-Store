<!DOCTYPE html>
<html>

<head>
    <title>Order Completed</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #7C5E4C; margin: 0;">Order Completed</h1>
        </div>

        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 5px;">
            <p style="margin-bottom: 15px;">Dear {{ $orderName }},</p>

            <p style="margin-bottom: 15px;">We're pleased to inform you that your order #{{ $order->id }} has been completed.</p>

            <h2 style="color: #7C5E4C; margin-bottom: 15px;">Shipping Address:</h2>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0 0 5px 0;">{{ $orderName }}</p>
                <p style="margin: 0 0 5px 0;">{{ $shippingAddress['line1'] }}</p>
                @if($shippingAddress['line2'])
                <p style="margin: 0 0 5px 0;">{{ $shippingAddress['line2'] }}</p>
                @endif
                <p style="margin: 0 0 5px 0;">{{ $shippingAddress['city'] }}, {{ $shippingAddress['state'] }} {{ $shippingAddress['postal_code'] }}</p>
                <p style="margin: 0;">{{ $shippingAddress['country'] }}</p>
            </div>

            <h2 style="color: #7C5E4C; margin-bottom: 15px;">Order Details:</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Size</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orderItems as $item)
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ $item['name'] }}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">{{ $item['size'] }}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">{{ $item['quantity'] }}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">£{{ number_format($item['price'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                        <td style="padding: 10px; text-align: right; font-weight: bold;">£{{ number_format($totalAmount, 2) }}</td>
                    </tr>
                </tfoot>
            </table>

            <p style="margin-bottom: 15px;">Thank you for shopping with Nini's Store!</p>

            <p style="margin-bottom: 15px;">If you have any questions, please don't hesitate to contact us.</p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; font-size: 12px; color: #6c757d;">
            <p style="margin-bottom: 5px;">This is an automated message, please do not reply directly to this email.</p>
            <p style="margin: 0;">&copy; {{ date('Y') }} Nini's Garments. All rights reserved.</p>
        </div>
    </div>
</body>

</html>