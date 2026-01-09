import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy } from 'lucide-react';

import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Create Product', href: '#' }];

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

type category = {
    id: number,
    name: string
}

interface productPageProps { 
    product: product,
    all_authors: author[],
    all_categories: category[]
}

export default function Create({ all_authors, all_categories }: productPageProps) {

    const { auth } = usePage<SharedData>().props;

    const addForm = useForm({ 
        name: '', 
        regular_price: '', 
        sale_price: '',
        stock: '',
        sku: '',
        tax_status: '',
        tax_class: '',
        description: '',
        author_id: '',
        categories: [] as string[]
    });

    const multiSelectCategories = all_categories.map((category) => ({
        value: category.name,
        label: category.name
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('products.store', {
            onSuccess: () => { 
                addForm.reset(); 
            }
        }));
    };

    useEffect(() => {
        if (auth.user) {
            addForm.setData('author_id', auth.user.id.toString());
        }
    }, [addForm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex flex-1 flex-col gap-4 p-4">

                <div className="rounded-md border bg-white p-5">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <Label className="mb-2">Name</Label>
                            <Input 
                                value={addForm.data.name} 
                                onChange={e => addForm.setData('name', e.target.value)} 
                            />
                            {addForm.errors.name && 
                                <p className="text-xs text-red-500 mt-1">
                                    {addForm.errors.name}
                                </p>
                            }
                        </div>

                        <div className="flex justify-between gap-4">
                            <div className="w-1/3">
                                <Label className="mb-2">Regular Price</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.regular_price} 
                                    onChange={e => addForm.setData('regular_price', e.target.value)} 
                                />
                                {addForm.errors.regular_price && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.regular_price}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Sale Price</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.sale_price} 
                                    onChange={e => addForm.setData('sale_price', e.target.value)} 
                                />
                                {addForm.errors.sale_price && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.sale_price}
                                    </p>
                                }
                            </div>
                        
                            <div className="w-1/3">
                                <Label className="mb-2">Stock</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.stock} 
                                    onChange={e => addForm.setData('stock', e.target.value)} 
                                />
                                {addForm.errors.stock && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.stock}
                                    </p>
                                }
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <div className="w-1/3">
                                <Label className="mb-2">SKU</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.sku} 
                                    onChange={e => addForm.setData('sku', e.target.value)} 
                                />
                                {addForm.errors.sku && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.sku}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Tax Status</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.tax_status} 
                                    onChange={e => addForm.setData('tax_status', e.target.value)} 
                                />
                                {addForm.errors.tax_status && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.tax_status}
                                    </p>
                                }
                            </div>

                            <div className="w-1/3">
                                <Label className="mb-2">Tax Class</Label>
                                <Input 
                                    type="number"
                                    value={addForm.data.tax_class} 
                                    onChange={e => addForm.setData('tax_class', e.target.value)} 
                                />
                                {addForm.errors.tax_class && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {addForm.errors.tax_class}
                                    </p>
                                }
                            </div>
                        </div>

                        <div>
                            <Label className="mb-2">Description</Label>
                            <Textarea 
                                value={addForm.data.description} 
                                onChange={e => addForm.setData('description', e.target.value)} 
                            />
                            {addForm.errors.description && 
                                <p className="text-xs text-red-500 mt-1">
                                    {addForm.errors.description}
                                </p>
                            }
                        </div>

                        <div className="flex justify-between gap-4">
                            <div>
                                <Label className="mb-2">Categories</Label>
                                <MultiSelect 
                                    options={multiSelectCategories} 
                                    placeholder="Select categories..." 
                                    selected={addForm.data.categories}
                                    onChange={(values) => addForm.setData('categories', values)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="mb-2">Author</Label>
                            <Select 
                                value={addForm.data.author_id} 
                                onValueChange={(val) => addForm.setData('author_id', val)}
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
                            {addForm.errors.author_id && 
                                <p className="text-red-500 text-xs">
                                {addForm.errors.author_id}
                                </p>
                            }
                        </div>

                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                <Button type="submit" disabled={addForm.processing} className="bg-blue-600 hover:bg-blue-700">
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
