<?php

namespace Database\Seeders;

use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $user = User::firstOrCreate(
            ['email' => 'john@mail.com'],
            [
                'name' => 'John Doe',
                'password' => 'John_123',
                'email_verified_at' => now(),
            ]
        );

        // Permissions
        $permissions = [
            'view users',
            'create users',
            'edit users',
            'delete users',

            'view role/permissions',
            'create role/permissions',
            'edit role/permissions',
            'delete role/permissions',

            'view products',
            'create products',
            'edit products',
            'delete products',

            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            'view vendors',
            'create vendors',
            'edit vendors',
            'delete vendors',

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $vendor = Role::firstOrCreate(['name' => 'vendor']);
        $customer = Role::firstOrCreate(['name' => 'customer']);
        $subscriber = Role::firstOrCreate(['name' => 'subscriber']);

        // Assign permissions
        $superAdmin->givePermissionTo(Permission::all());
        $admin->givePermissionTo(Permission::all());

        // // Assign role to user
        $user->assignRole($admin);
    }
}
