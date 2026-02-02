<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;

use Inertia\Inertia;

class VendorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vendors = User::whereHas('roles', function($query) {
                    $query->where('name', 'vendor');
                })->with('roles')->get()->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'roles' => $user->roles->pluck('name'), 
                        'products' => $user->products,
                        'created_at' => $user->created_at->format('Y-m-d'),
                    ];
                });
        
        return Inertia::render('vendors/index', [
            'vendors' => $vendors,
        ]);
    }

    /**
     * Get the vendor's products
     */
    public function products(User $user)
    {
        $products = $user->products()
            ->with(['author', 'categories'])
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'image' => $product->image,
                    'name' => $product->name,
                    'regular_price' => $product->regular_price,
                    'sale_price' => $product->sale_price,
                    'stock' => $product->stock,
                    'sku' => $product->sku,
                    'tax_status' => $product->tax_status,
                    'tax_class' => $product->tax_class,
                    'description' => $product->description,
                    'categories' => $product->categories->pluck('name'),
                    'author_id' => $product->author_id,
                    'gallery' => $product->gallery,
                ];
            });

        return Inertia::render('products/index', [
            'products' => $products,
            'all_authors' => User::select('id', 'name')->get(),
            'all_categories' => Category::pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
