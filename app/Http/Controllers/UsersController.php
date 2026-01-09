<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\DB;

use App\Models\User;

use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'), 
                'created_at' => $user->created_at->format('Y-m-d'),
            ];
        });

        return Inertia::render('users/index', [
            'users' => $users,
            'all_roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('users/create', [
            'roles' => Role::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'nullable|string|exists:roles,name', 
            'billing_address_line_1' => 'nullable|max:255',
            'billing_address_line_2' => 'nullable|max:255',
            'billing_phone_number' => 'nullable|max:255',
            'billing_city' => 'nullable|max:255',
            'billing_state' => 'nullable|max:255',
            'billing_postal_code' => 'nullable|max:255',
            'billing_country' => 'nullable|max:255',
            'shipping_address_line_1' => 'nullable|max:255',
            'shipping_address_line_2' => 'nullable|max:255',
            'shipping_phone_number' => 'nullable|max:255',
            'shipping_city' => 'nullable|max:255',
            'shipping_state' => 'nullable|max:255',
            'shipping_postal_code' => 'nullable|max:255',
            'shipping_country' => 'nullable|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('customer');

        $this->create__update_billing_address($user, $validated);
        $this->create__update_shipping_address($user, $validated);

        return redirect()->route('users')->with('success', 'User created successfully!');
    }

    /**
     * Assign a specific role to a specific user.
     */
    public function assignRole(Request $request)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::find($request->user);
        $user->assignRole($request->role);

        return back()->with('success', 'Role added successfully');
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
    public function edit(User $user)
    {
        $billing_address = DB::table('user_billing_address')->where('user_id', $user->id)->first();
        $shipping_address = DB::table('user_shipping_address')->where('user_id', $user->id)->first();
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'billing_address' => $billing_address,
            'shipping_address' => $shipping_address
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'billing_address_line_1' => 'nullable|max:255',
            'billing_address_line_2' => 'nullable|max:255',
            'billing_phone_number' => 'nullable|max:255',
            'billing_city' => 'nullable|max:255',
            'billing_state' => 'nullable|max:255',
            'billing_postal_code' => 'nullable|max:255',
            'billing_country' => 'nullable|max:255',
            'shipping_address_line_1' => 'nullable|max:255',
            'shipping_address_line_2' => 'nullable|max:255',
            'shipping_phone_number' => 'nullable|max:255',
            'shipping_city' => 'nullable|max:255',
            'shipping_state' => 'nullable|max:255',
            'shipping_postal_code' => 'nullable|max:255',
            'shipping_country' => 'nullable|max:255',
        ]);

        $this->create__update_billing_address($user, $validated);
        $this->create__update_shipping_address($user, $validated);

        $user->update([
            'name' => $validated['name'], 
            'email' => $validated['email']
        ]);

        return redirect()->route('users')->with('success', 'User updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted successfully');
    }

    /**
     * Remove a specific role from a specific user.
     */
    public function revokeRole(User $user, Role $role)
    {
        $user->removeRole($role);
    
        return back()->with('success', 'Role removed successfully');
    }

    /**
     * Create or Update - billing address of a user
     */
    public function create__update_billing_address($user, $data)
    {
        $data = [
            'user_id' => $user->id,
            'address_line_1' => $data['billing_address_line_1'],
            'address_line_2' => $data['billing_address_line_2'],
            'phone_number' => $data['billing_phone_number'],
            'city' => $data['billing_city'],
            'state' => $data['billing_state'],
            'postal_code' => $data['billing_postal_code'],
            'country' => $data['billing_country']
        ];

        $billingAddressTable = DB::table('user_billing_address');
        $checkUserHasBillingAddress = $billingAddressTable->where('user_id', $user->id)->exists();
        return $checkUserHasBillingAddress ? $billingAddressTable->update($data) : $billingAddressTable->insert($data);
    }

    /**
     * Create or Update - shipping address of a user
     */
    public function create__update_shipping_address($user, $data)
    {
        $data = [
            'user_id' => $user->id,
            'address_line_1' => $data['billing_address_line_1'],
            'address_line_2' => $data['billing_address_line_2'],
            'phone_number' => $data['billing_phone_number'],
            'city' => $data['billing_city'],
            'state' => $data['billing_state'],
            'postal_code' => $data['billing_postal_code'],
            'country' => $data['billing_country']
        ];

        $shippingAddressTable = DB::table('user_shipping_address');
        $checkUserHasShippingAddress = $shippingAddressTable->where('user_id', $user->id)->exists();
        return $checkUserHasShippingAddress ? $shippingAddressTable->update($data) : $shippingAddressTable->insert($data);
    }
}
