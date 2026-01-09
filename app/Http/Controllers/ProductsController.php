<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Inertia\Inertia;

use Illuminate\Support\Facades\DB;

use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $products = Product::with('author')->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'regular_price' => $product->regular_price,
                'sale_price' => $product->sale_price,
                'stock' => $product->stock,
                'tax_status' => $product->tax_status,
                'tax_class' => $product->tax_class,
                'description' => $product->description,
                'categories' => DB::table('product_has_categories')
                            ->where('product_id', $product->id)
                            ->join('categories', 'product_has_categories.category_id', '=', 'categories.id')
                            ->pluck('categories.name')
                            ->toArray(),
                'author_id' => $product->author_id,
            ];
        });

        return Inertia::render('products/index', [
            'products' => $products,
            'authors' => User::select('id', 'name')->get(),
            'all_categories' => Category::pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('products/create', [
            'categories' => Category::select('id', 'name')->get(),
            'authors' => User::select('id', 'name')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sku' => 'nullable|string',
            'tax_status' => 'required|string',
            'tax_class' => 'nullable|string',
            'description' => 'nullable|string',
            'author_id' => 'required|exists:users,id',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'regular_price' => $validated['regular_price'],
            'sale_price' => $validated['sale_price'],
            'stock' => $validated['stock'],
            'sku' => $validated['sku'],
            'tax_status' => $validated['tax_status'],
            'tax_class' => $validated['tax_class'],
            'description' => $validated['description'],
            'author_id' => $validated['author_id'],
        ]);

        if ($request->has('categories')) {

            foreach ($request->categories as $catName) {
                
                $category = Category::where('name', $catName)->first();

                $checkProductHasCategory = DB::table('product_has_categories')
                    ->where('product_id', $product->id)
                    ->where('category_id', $category->id)
                    ->exists();

                if (!$checkProductHasCategory) {
                    DB::table('product_has_categories')->insert([
                        'product_id' => $product->id,
                        'category_id' => $category->id,
                    ]);
                }
            }
        }

        return redirect()->route('products')->with('success', 'Product created successfully!');
    }

    /**
     * Assign a specific category to a specific product.
     */
    public function assignCategory(Request $request, Product $product)
    {
        $category = Category::where('name', $request->category)->first();

        $checkProductHasCategory = DB::table('product_has_categories')
                ->where('product_id', $product->id)
                ->where('category_id', $category->id)
                ->exists();

        if (!$checkProductHasCategory) {
            DB::table('product_has_categories')->insert([
                'product_id' => $product->id,
                'category_id' => $category->id,
            ]);
        }

        return back()->with('success', 'Category added successfully');
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
    public function edit(Product $product)
    {
        return Inertia::render('products/edit', [
            'product' => $product,
            'authors' => User::select('id', 'name')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('products')->ignore($product->id)
            ],
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sku' => 'nullable|string',
            'tax_status' => 'required|string',
            'tax_class' => 'nullable|string',
            'description' => 'nullable|string',
            'author_id' => 'required|exists:users,id',
        ]);

        $product->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'regular_price' => $validated['regular_price'],
            'sale_price' => $validated['sale_price'],
            'stock' => $validated['stock'],
            'sku' => $validated['sku'],
            'tax_status' => $validated['tax_status'],
            'tax_class' => $validated['tax_class'],
            'description' => $validated['description'],
            'author_id' => $validated['author_id'],
        ]);

        return redirect()->route('products')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Product deleted successfully');
    }

    /**
     * Remove a specific category from a specific product.
     */
    public function revokeCategory(Request $request, Product $product)
    {

        $category = Category::where('name', $request->category)->first();

        $checkProductHasCategory = DB::table('product_has_categories')
                ->where('product_id', $product->id)
                ->where('category_id', $category->id)
                ->exists();

        if ($checkProductHasCategory) {

            DB::table('product_has_categories')
                ->where('product_id', $product->id)
                ->where('category_id', $category->id)
                ->delete();

            return back()->with('success', 'Category removed successfully');

        }
    }
}
