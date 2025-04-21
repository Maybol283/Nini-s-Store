<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a temporary admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ninisstore.com',
            'password' => Hash::make('admin123'), // Temporary password, change in production
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Temporary admin user created:');
        $this->command->info('Email: admin@ninisstore.com');
        $this->command->info('Password: admin123');
        $this->command->warn('Please change this password in production!');
    }
}
