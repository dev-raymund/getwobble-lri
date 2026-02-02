<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\HomeController;

use App\Http\Controllers\UsersController;
use App\Http\Controllers\RolesPermissionsController;

use App\Http\Controllers\ProductsController;
use App\Http\Controllers\CategoriesController;

use App\Http\Controllers\VendorsController;

// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('bookings', function () {
        return Inertia::render('bookings/index');
    })->name('bookings');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('orders', function () {
        return Inertia::render('orders/index');
    })->name('orders');
});

// Vendors
Route::get('/vendors', [VendorsController::class, 'index'])
    ->middleware(['auth', 'permission:view vendors'])
    ->name('vendors');

Route::get('/vendors/{user}/products', [VendorsController::class, 'products'])
    ->middleware(['auth', 'permission:view products'])
    ->name('products.vendor');

// Users
Route::get('/users', [UsersController::class, 'index'])
    ->middleware(['auth', 'permission:view users'])
    ->name('users');

Route::post('/users', [UsersController::class, 'store'])
    ->middleware(['auth', 'permission:create users'])
    ->name('users.store');

Route::post('/users/{user}/roles', [UsersController::class, 'assignRole'])
    ->middleware(['auth', 'permission:edit users'])
    ->name('users.roles.store');

Route::get('/users/create', [UsersController::class, 'create'])
    ->middleware(['auth', 'permission:create users'])
    ->name('users.create');

Route::get('/users/{user}', [UsersController::class, 'edit'])
    ->middleware(['auth', 'permission:edit users'])
    ->name('users.edit');

Route::put('/users/{user}', [UsersController::class, 'update'])
    ->middleware(['auth', 'permission:edit users'])
    ->name('users.update');

Route::delete('/users/{user}/roles/{role:name}', [UsersController::class, 'revokeRole'])
    ->middleware(['auth', 'permission:edit users'])
    ->name('users.roles.revoke');

Route::delete('/users/{user}', [UsersController::class, 'destroy'])
    ->middleware(['auth', 'permission:delete users'])
    ->name('users.destroy');

// Products
Route::get('/products', [ProductsController::class, 'index'])
    ->middleware(['auth', 'permission:view products'])
    ->name('products');

Route::get('/products/create', [ProductsController::class, 'create'])
    ->middleware(['auth', 'permission:create products'])
    ->name('products.create');

Route::get('/api/products/search-authors', [ProductsController::class, 'searchAuthors'])
    ->middleware(['auth'])
    ->name('products.search-authors');

Route::get('/products/{product}', [ProductsController::class, 'edit'])
    ->middleware(['auth', 'permission:edit products'])
    ->name('products.edit');

Route::post('/products', [ProductsController::class, 'store'])
    ->middleware(['auth', 'permission:create products'])
    ->name('products.store');

Route::put('/products/{product}', [ProductsController::class, 'update'])
    ->middleware(['auth', 'permission:edit products'])
    ->name('products.update');

Route::delete('/products/{product}', [ProductsController::class, 'destroy'])
    ->middleware(['auth', 'permission:delete products'])
    ->name('products.destroy');

Route::post('/products/{product}/categories', [ProductsController::class, 'assignCategory'])
    ->middleware(['auth', 'permission:edit products'])
    ->name('products.categories.store');

Route::delete('/products/{product}/category/{category:name}', [ProductsController::class, 'revokeCategory'])
    ->middleware(['auth', 'permission:edit products'])
    ->name('products.categories.revoke');


// Categories
Route::get('/categories', [CategoriesController::class, 'index'])
    ->middleware(['auth', 'permission:view categories'])
    ->name('categories');

Route::post('/categories', [CategoriesController::class, 'store'])
    ->middleware(['auth', 'permission:create categories'])
    ->name('categories.store');

Route::put('/categories/{category}', [CategoriesController::class, 'update'])
    ->middleware(['auth', 'permission:edit categories'])
    ->name('categories.update');

Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])
    ->middleware(['auth', 'permission:delete categories'])
    ->name('categories.destroy');


// Roles / Permissions
Route::get('/roles-permissions', [RolesPermissionsController::class, 'index'])
    ->middleware(['auth', 'permission:view role/permissions'])
    ->name('roles_permissions');

Route::post('/roles-permissions', [RolesPermissionsController::class, 'store'])
    ->middleware(['auth', 'permission:create role/permissions'])
    ->name('roles.store');

Route::post('/roles/{role}/permissions', [RolesPermissionsController::class, 'assignPermissions'])
    ->middleware(['auth', 'permission:edit role/permissions'])
    ->name('roles.permissions.assign');

Route::put('/roles/{role}', [RolesPermissionsController::class, 'updateRoleName'])
    ->middleware(['auth', 'permission:edit role/permissions'])
    ->name('roles.update');

Route::delete('/roles/{role}/permissions/{permission}', [RolesPermissionsController::class, 'revokePermissions'])
    ->middleware(['auth', 'permission:edit role/permissions'])
    ->name('roles.permissions.revoke');

Route::delete('/roles/{role}', [RolesPermissionsController::class, 'destroy'])
    ->middleware(['auth', 'permission:delete role/permissions'])
    ->name('roles.destroy');

require __DIR__.'/settings.php';
