<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->enum('category', ['scarves', 'sweaters', 'hats', 'gloves', 'miscellaneous']);
            $table->enum('age_group', ['adult', 'baby']);
            $table->json('sizes'); // Will contain either adult or baby sizes based on age_group
            $table->json('images'); // Array of image objects with src and alt
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();
            $table->softDeletes(); // For product archiving
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
