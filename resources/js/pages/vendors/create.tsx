import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Create User', href: '#' }];

type user = {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    billing_address_line_1: string,
    billing_address_line_2: string,
    billing_phone_number: string,
    billing_city: string,
    billing_state: string,
    billing_postal_code: string,
    billing_country: string,
    shipping_address_line_1: string,
    shipping_address_line_2: string,
    shipping_phone_number: string,
    shipping_city: string,
    shipping_state: string,
    shipping_postal_code: string,
    shipping_country: string
}

type role = {
    id: number,
    name: string
}

interface createUserPageProps { 
    user: user,
    all_roles: role[]
}

export default function Create({ all_roles }: createUserPageProps) {

    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
        billing_address_line_1: '',
        billing_address_line_2: '',
        billing_phone_number: '',
        billing_city: '',
        billing_state: '',
        billing_postal_code: '',
        billing_country: '',
        shipping_address_line_1: '',
        shipping_address_line_2: '',
        shipping_phone_number: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: '',
    });
    
    const multiSelectRoles = all_roles.map((role) => ({
        value: role.name,
        label: role.name
    }));

    const copyBillingToShipping = () => {
        addForm.setData({
            ...addForm.data,
            shipping_address_line_1: addForm.data.billing_address_line_1,
            shipping_address_line_2: addForm.data.billing_address_line_2,
            shipping_phone_number: addForm.data.billing_phone_number,
            shipping_city: addForm.data.billing_city,
            shipping_state: addForm.data.billing_state,
            shipping_postal_code: addForm.data.billing_postal_code,
            shipping_country: addForm.data.billing_country,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('users.store', {
            onSuccess: () => { 
                addForm.reset(); 
            }
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex flex-1 flex-col gap-4 p-4">

                <div className="">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="rounded-md border p-5 flex flex-col gap-4">
                            <div className="flex justify-between gap-4">
                                <div className="w-1/2">
                                    <Label htmlFor="name" className="mb-2">Name</Label>
                                    <Input 
                                        id="name" 
                                        value={addForm.data.name} 
                                        onChange={e => addForm.setData('name', e.target.value)} 
                                    />
                                    {addForm.errors.name && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.name}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/2">
                                    <Label htmlFor="email" className="mb-2">Email</Label>
                                    <Input 
                                        id="email" 
                                        value={addForm.data.email} 
                                        onChange={e => addForm.setData('email', e.target.value)} 
                                    />
                                    {addForm.errors.email && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.email}
                                        </p>
                                    }
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/2">
                                    <Label className="mb-2">Password</Label>
                                    <Input 
                                        type="password" 
                                        value={addForm.data.password} 
                                        onChange={e => addForm.setData('password', e.target.value)} 
                                    />
                                    {addForm.errors.password && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.password}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/2">
                                    <Label className="mb-2">Confirm Password</Label>
                                    <Input 
                                        type="password" 
                                        value={addForm.data.password_confirmation} 
                                        onChange={e => addForm.setData('password_confirmation', e.target.value)} 
                                    />
                                </div>
                            </div>
                        
                            <div className="flex justify-between gap-4">
                                <div>
                                    <Label className="mb-2">Roles</Label>
                                    <MultiSelect 
                                        options={multiSelectRoles} 
                                        placeholder="Select role..." 
                                        selected={addForm.data.roles}
                                        onChange={(values) => addForm.setData('roles', values)}
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
                                        value={addForm.data.billing_address_line_1} 
                                        onChange={e => addForm.setData('billing_address_line_1', e.target.value)} 
                                    />
                                    {addForm.errors.billing_address_line_1 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_address_line_1}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="billing_address_line_2" className="mb-2">Address Line 2 (Optional)</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_address_line_2} 
                                        onChange={e => addForm.setData('billing_address_line_2', e.target.value)} 
                                    />
                                    {addForm.errors.billing_address_line_2 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_address_line_2}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="billing_phone_number" className="mb-2">Phone Number</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_phone_number} 
                                        onChange={e => addForm.setData('billing_phone_number', e.target.value)} 
                                    />
                                    {addForm.errors.billing_phone_number && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_phone_number}
                                        </p>
                                    }
                                </div> 
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/4">
                                    <Label htmlFor="billing_city" className="mb-2">City</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_city} 
                                        onChange={e => addForm.setData('billing_city', e.target.value)} 
                                    />
                                    {addForm.errors.billing_city && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_city}
                                        </p>
                                    }
                                </div> 
                                <div className="w-1/4">
                                    <Label htmlFor="billing_state" className="mb-2">State</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_state} 
                                        onChange={e => addForm.setData('billing_state', e.target.value)} 
                                    />
                                    {addForm.errors.billing_state && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_state}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="billing_postal_code" className="mb-2">Postal Code</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_postal_code} 
                                        onChange={e => addForm.setData('billing_postal_code', e.target.value)} 
                                    />
                                    {addForm.errors.billing_postal_code && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_postal_code}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="billing_country" className="mb-2">Country</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.billing_country} 
                                        onChange={e => addForm.setData('billing_country', e.target.value)} 
                                    />
                                    {addForm.errors.billing_country && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.billing_country}
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
                                        value={addForm.data.shipping_address_line_1} 
                                        onChange={e => addForm.setData('shipping_address_line_1', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_address_line_1 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_address_line_1}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="shipping_address_line_2" className="mb-2">Address Line 2 (Optional)</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_address_line_2} 
                                        onChange={e => addForm.setData('shipping_address_line_2', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_address_line_2 && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_address_line_2}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/3">
                                    <Label htmlFor="shipping_phone_number" className="mb-2">Phone Number</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_phone_number} 
                                        onChange={e => addForm.setData('shipping_phone_number', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_phone_number && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_phone_number}
                                        </p>
                                    }
                                </div> 
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_city" className="mb-2">City</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_city} 
                                        onChange={e => addForm.setData('shipping_city', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_city && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_city}
                                        </p>
                                    }
                                </div> 
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_state" className="mb-2">State</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_state} 
                                        onChange={e => addForm.setData('shipping_state', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_state && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_state}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_postal_code" className="mb-2">Postal Code</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_postal_code} 
                                        onChange={e => addForm.setData('shipping_postal_code', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_postal_code && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_postal_code}
                                        </p>
                                    }
                                </div>
                                <div className="w-1/4">
                                    <Label htmlFor="shipping_country" className="mb-2">Country</Label>
                                    <Input 
                                        type="text" 
                                        value={addForm.data.shipping_country} 
                                        onChange={e => addForm.setData('shipping_country', e.target.value)} 
                                    />
                                    {addForm.errors.shipping_country && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {addForm.errors.shipping_country}
                                        </p>
                                    }
                                </div>
                                
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                <Button type="submit" disabled={addForm.processing} variant="brand">
                                    Create
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        </AppLayout>
    );
}
