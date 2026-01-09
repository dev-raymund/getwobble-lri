import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';

import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit User', href: '#' }];

type product = { 
    id: number,
    name: string,
    regular_price: number,
    sale_price: number,
    stock: number,
    sku: string,
    tax_status: string,
    tax_class: string,
    description: string,
    categories: string[],
    author_id: number
}

type author = {
    id: number,
    name: string
}

interface editProductPageProps {
    product: product,
    categories: string[],
    all_authors: author[]
}

export default function Edit({ product, categories, all_authors }: editProductPageProps) {

    const { auth } = usePage<SharedData>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        regular_price: product.regular_price || '', 
        sale_price: product.sale_price || '',
        stock: product.stock || '',
        sku: product.sku || '',
        tax_status: product.tax_status || '',
        tax_class: product.tax_class || '',
        description: product.description || '',
        author_id: product.author_id || '',
        categories: categories
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', { product: product.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex flex-1 flex-col gap-4 p-4">

                <div className="rounded-md border bg-white p-5">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <Label className="mb-2">Name</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                            />
                            {errors.name && 
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            }
                        </div>

                        <div className="flex justify-between gap-4">
                            <div className="w-1/3">
                                <Label className="mb-2">Regular Price</Label>
                                <Input 
                                    type="number"
                                    value={data.regular_price} 
                                    onChange={e => setData('regular_price', e.target.value)} 
                                />
                                {errors.regular_price && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.regular_price}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Sale Price</Label>
                                <Input 
                                    type="number"
                                    value={data.sale_price} 
                                    onChange={e => setData('sale_price', e.target.value)} 
                                />
                                {errors.sale_price && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.sale_price}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Stock</Label>
                                <Input 
                                    type="number"
                                    value={data.stock} 
                                    onChange={e => setData('stock', e.target.value)} 
                                />
                                {errors.stock && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.stock}
                                    </p>
                                }
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <div className="w-1/3">
                                <Label className="mb-2">SKU</Label>
                                <Input 
                                    type="number"
                                    value={data.sku} 
                                    onChange={e => setData('sku', e.target.value)} 
                                />
                                {errors.sku && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.sku}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Tax Status</Label>
                                <Input 
                                    type="number"
                                    value={data.tax_status} 
                                    onChange={e => setData('tax_status', e.target.value)} 
                                />
                                {errors.tax_status && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.tax_status}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Tax Class</Label>
                                <Input 
                                    type="number"
                                    value={data.tax_class} 
                                    onChange={e => setData('tax_class', e.target.value)} 
                                />
                                {errors.tax_class && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.tax_class}
                                    </p>
                                }
                            </div>

                        </div>

                        <div>
                            <Label className="mb-2">Description</Label>
                            <Textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                            />
                            {errors.description && 
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.description}
                                </p>
                            }
                        </div>

                        <div>
                            <Label className="mb-2">Author</Label>
                            <Select 
                                value={data.author_id?.toString()} 
                                onValueChange={(val) => setData('author_id', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Author" />
                                </SelectTrigger>
                                <SelectContent>
                                    {all_authors.map((author) => (
                                        <SelectItem key={author.id} value={author.id.toString()}>
                                            {author.name} {author.id === auth.user.id && "(You)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.author_id && 
                                <p className="text-red-500 text-xs">
                                {errors.author_id}
                                </p>
                            }
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
