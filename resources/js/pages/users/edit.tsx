import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit User', href: '#' }];

type user = {
    id: number,
    name: string,
    email: string
}

type role = {
    id: number,
    name: string
}

type billing_address = {
    address_line_1: string,
    address_line_2: string,
    phone_number: string,
    city: string,
    state: string,
    postal_code: string,
    country: string
}

type shipping_address = {
    address_line_1: string,
    address_line_2: string,
    phone_number: string,
    city: string,
    state: string,
    postal_code: string,
    country: string
}

interface editUserPageProps {
    user: user,
    roles: string[],
    billing_address: billing_address,
    shipping_address: shipping_address,
    all_roles: role[]
}

export default function Edit({ user, roles, billing_address, shipping_address, all_roles }: editUserPageProps) {
    
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        roles: roles,
        billing_address_line_1: billing_address?.address_line_1 || '',
        billing_address_line_2: billing_address?.address_line_2 || '',
        billing_phone_number: billing_address?.phone_number || '',
        billing_city: billing_address?.city || '',
        billing_state: billing_address?.state || '',
        billing_postal_code: billing_address?.postal_code || '',
        billing_country: billing_address?.country || '',
        shipping_address_line_1: shipping_address?.address_line_1 || '',
        shipping_address_line_2: shipping_address?.address_line_2 || '',
        shipping_phone_number: shipping_address?.phone_number || '',
        shipping_city: shipping_address?.city || '',
        shipping_state: shipping_address?.state || '',
        shipping_postal_code: shipping_address?.postal_code || '',
        shipping_country: shipping_address?.country || '',
    });

    const multiSelectRoles = all_roles.map((role) => ({
        value: role.name,
        label: role.name
    }));

    const copyBillingToShipping = () => {
        setData({
            ...data, // Preserve existing names, emails, and passwords
            shipping_address_line_1: data.billing_address_line_1,
            shipping_address_line_2: data.billing_address_line_2,
            shipping_phone_number: data.billing_phone_number,
            shipping_city: data.billing_city,
            shipping_state: data.billing_state,
            shipping_postal_code: data.billing_postal_code,
            shipping_country: data.billing_country,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', { user: user.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex flex-1 flex-col gap-4 p-4">

                <div className="">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="rounded-md border p-5 flex flex-col gap-4">
                            <div className="flex justify-between gap-4">
                                <div className="w-1/2">
                                    <Label htmlFor="name" className="mb-2">Name</Label>
                                    <Input 
                                        id="name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                    />
                                    {errors.name && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.name}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/2">
                                    <Label htmlFor="email" className="mb-2">Email</Label>
                                    <Input 
                                        id="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                    />
                                    {errors.email && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.email}
                                        </p>
                                    }
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <div>
                                    <Label className="mb-2">Roles</Label>
                                    <MultiSelect 
                                        options={multiSelectRoles} 
                                        placeholder="Select role..." 
                                        selected={data.roles}
                                        onChange={(values) => setData('roles', values)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h6 className="font-bold">Billing Address</h6>
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/3">
                                    <Label htmlFor="billing_address_line_1" className="mb-2">Address Line 1</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_address_line_1} 
                                        onChange={e => setData('billing_address_line_1', e.target.value)} 
                                    />
                                    {errors.billing_address_line_1 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_address_line_1}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="billing_address_line_2" className="mb-2">Address Line 2 (Optional)</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_address_line_2} 
                                        onChange={e => setData('billing_address_line_2', e.target.value)} 
                                    />
                                    {errors.billing_address_line_2 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_address_line_2}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="billing_phone_number" className="mb-2">Phone Number</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_phone_number} 
                                        onChange={e => setData('billing_phone_number', e.target.value)} 
                                    />
                                    {errors.billing_phone_number && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_phone_number}
                                        </p>
                                    }
                                </div> 
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/4">
                                    <Label htmlFor="billing_city" className="mb-2">City</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_city} 
                                        onChange={e => setData('billing_city', e.target.value)} 
                                    />
                                    {errors.billing_city && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_city}
                                        </p>
                                    }
                                </div> 
                                <div className="w-1/4">
                                    <Label htmlFor="billing_state" className="mb-2">State</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_state} 
                                        onChange={e => setData('billing_state', e.target.value)} 
                                    />
                                    {errors.billing_state && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_state}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="billing_postal_code" className="mb-2">Postal Code</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_postal_code} 
                                        onChange={e => setData('billing_postal_code', e.target.value)} 
                                    />
                                    {errors.billing_postal_code && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_postal_code}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="billing_country" className="mb-2">Country</Label>
                                    <Input 
                                        type="text" 
                                        value={data.billing_country} 
                                        onChange={e => setData('billing_country', e.target.value)} 
                                    />
                                    {errors.billing_country && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.billing_country}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h6 className="font-bold">Shipping Address</h6>
                            </div>

                            <div className="flex items-center gap-4">
                                <p className="text-xs">Copy from billing address</p>
                                <Button
                                    type="button"
                                    className="flex items-center gap-2"
                                    onClick={copyBillingToShipping}
                                >
                                    <Copy className="h-1 w-1" />
                                    Copy
                                </Button>
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/3">
                                    <Label htmlFor="shipping_address_line_1" className="mb-2">Address Line 1</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_address_line_1} 
                                        onChange={e => setData('shipping_address_line_1', e.target.value)} 
                                    />
                                    {errors.shipping_address_line_1 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_address_line_1}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="shipping_address_line_2" className="mb-2">Address Line 2 (Optional)</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_address_line_2} 
                                        onChange={e => setData('shipping_address_line_2', e.target.value)} 
                                    />
                                    {errors.shipping_address_line_2 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_address_line_2}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="shipping_phone_number" className="mb-2">Phone Number</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_phone_number} 
                                        onChange={e => setData('shipping_phone_number', e.target.value)} 
                                    />
                                    {errors.shipping_phone_number && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_phone_number}
                                        </p>
                                    }
                                </div> 
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_city" className="mb-2">City</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_city} 
                                        onChange={e => setData('shipping_city', e.target.value)} 
                                    />
                                    {errors.shipping_city && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_city}
                                        </p>
                                    }
                                </div> 
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_state" className="mb-2">State</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_state} 
                                        onChange={e => setData('shipping_state', e.target.value)} 
                                    />
                                    {errors.shipping_state && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_state}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_postal_code" className="mb-2">Postal Code</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_postal_code} 
                                        onChange={e => setData('shipping_postal_code', e.target.value)} 
                                    />
                                    {errors.shipping_postal_code && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_postal_code}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_country" className="mb-2">Country</Label>
                                    <Input 
                                        type="text" 
                                        value={data.shipping_country} 
                                        onChange={e => setData('shipping_country', e.target.value)} 
                                    />
                                    {errors.shipping_country && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.shipping_country}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    Update
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </AppLayout>
    );
}
