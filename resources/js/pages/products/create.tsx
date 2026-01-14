import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from "@/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus } from 'lucide-react';

import { type SharedData } from '@/types';
import { categories } from '@/routes';
import { error } from 'console';

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

export default function Create({ product, all_authors, all_categories }: productPageProps) {

    const { auth } = usePage<SharedData>().props;

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const addForm = useForm({
        image: null as File | null,
        gallery: [] as File[],
        name: '',
        regular_price: '',
        sale_price: '',
        stock: '',
        sku: '',
        tax_status: '',
        tax_class: '',
        description: '',
        author_id: auth.user?.id.toString() || '',
        categories: [] as string[]
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            addForm.setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {

            const newGallery = [...addForm.data.gallery, ...files];
            addForm.setData('gallery', newGallery);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = addForm.data.gallery.filter((_, i) => i !== index);
        const newPreviews = galleryPreviews.filter((_, i) => i !== index);
        
        addForm.setData('gallery', newGallery);
        setGalleryPreviews(newPreviews);
    };

    const TAX_STATUS = [
        { value: "none", label: "None" },
        { value: "taxable", label: "Taxable" },
        { value: "shipping_only", label: "Shipping Only" }
    ];

    const TAX_CLASS = [
        { value: "standard", label: "Standard" },
        { value: "reduced_rate", label: "Reduced rate" },
        { value: "zero_rate", label: "Zero rate" }
    ];

    const multiSelectCategories = all_categories.map((category) => ({
        value: category.name,
        label: category.name
    }));

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;

        if (addForm.data.categories.includes(newCategory)) {
            setIsAddingCategory(false);
            return;
        }

        router.post(route('categories.store'), {
            name: newCategory,
            description: ""
        }, {
            onSuccess: () => {
                addForm.setData('categories', [...addForm.data.categories, newCategory]);

                setNewCategory("");
                setIsAddingCategory(false);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => addForm.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex flex-1 flex-col gap-4 p-4">

                <div className="">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-6">

                            <div className="w-2/3 flex flex-col gap-6">

                                <div className="rounded-md border p-5 flex flex-col gap-6">
                                    <div className="flex justify-between gap-4">
                                        <div className="w-full">
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
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <div className="w-full">
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
                                    </div>

                                </div>

                                <div className="rounded-md border p-5 flex flex-col gap-6">

                                    <div className="flex justify-between gap-4">
                                        <div className="w-1/2">
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

                                        <div className="w-1/2">
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

                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <div className="w-1/2">
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

                                        <div className="w-1/2">
                                            <Label className="mb-2">SKU</Label>
                                            <Input
                                                type="text"
                                                value={addForm.data.sku}
                                                onChange={e => addForm.setData('sku', e.target.value)}
                                            />
                                            {addForm.errors.sku &&
                                                <p className="text-xs text-red-500 mt-1">
                                                    {addForm.errors.sku}
                                                </p>
                                            }
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4">

                                        <div className="w-1/2">
                                            <Label className="mb-2">Tax Status</Label>
                                            <Select
                                                value={addForm.data.tax_status}
                                                onValueChange={(val) => addForm.setData('tax_status', val)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select tax status" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    {TAX_STATUS.map((item) => (
                                                        <SelectItem key={item.value} value={item.value.toString()}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {addForm.errors.tax_status &&
                                                <p className="text-xs text-red-500 mt-1">
                                                    {addForm.errors.tax_status}
                                                </p>
                                            }
                                        </div>

                                        <div className="w-1/2">
                                            <Label className="mb-2">Tax Class</Label>
                                            <Select
                                                value={addForm.data.tax_class}
                                                onValueChange={(val) => addForm.setData('tax_class', val)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select tax class" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    {TAX_CLASS.map((item) => (
                                                        <SelectItem key={item.value} value={item.value.toString()}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {addForm.errors.tax_class &&
                                                <p className="text-xs text-red-500 mt-1">
                                                    {addForm.errors.tax_class}
                                                </p>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="w-1/3 rounded-md border p-5 flex flex-col gap-6">

                                <div className="flex justify-between gap-4">
                                    <div className="w-full">
                                        <Label className="mb-2">Featured Image</Label>
                                        
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                        <div className="relative group">
                                            {imagePreview ? (
                                                <div className="relative w-full aspect-square max-h-64 overflow-hidden rounded-md border bg-gray-50">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="h-full w-full object-contain shadow-sm"
                                                    />
                                                    
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => document.getElementById('image-upload')?.click()}
                                                        >
                                                            Change
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                setImagePreview(null);
                                                                addForm.setData('image', null);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex flex-col items-center justify-center w-full aspect-square max-h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-500 font-semibold">Click to upload</p>
                                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                                                    </div>
                                                </label>
                                            )}
                                        </div>

                                        {addForm.errors.image && (
                                            <p className="text-xs text-red-500 mt-1">{addForm.errors.image}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <div className="w-full">
                                        <Label className="mb-2">Gallery</Label>
                                        <input
                                            type="file"
                                            id="gallery-upload"
                                            multiple
                                            accept="image/*"
                                            onChange={handleGalleryChange}
                                            className="hidden"
                                        />
                                        
                                        <div className="grid grid-cols-4 gap-2 mt-2">
                                            {galleryPreviews.map((src, index) => (
                                                <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                                                    <img src={src} className="object-cover w-full h-full" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Plus className="w-3 h-3 rotate-45" />
                                                    </button>
                                                </div>
                                            ))}
                                            <label
                                                htmlFor="gallery-upload"
                                                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                                            >
                                                <Plus className="w-6 h-6 text-gray-400" />
                                                <span className="text-[10px] text-gray-500">Add More</span>
                                            </label>
                                        </div>

                                        {Object.keys(addForm.errors).map((key) => {
                                            if (key.startsWith('gallery.')) {
                                                return (
                                                    <p key={key} className="text-xs text-red-500 mt-1">
                                                        {addForm.errors[key as keyof typeof addForm.errors]}
                                                    </p>
                                                );
                                            }
                                            return null;
                                        })}

                                    </div>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <div className="w-full">
                                        <Label className="mb-2">Author</Label>
                                        <Select
                                            value={addForm.data.author_id}
                                            onValueChange={(val) => addForm.setData('author_id', val)}
                                        >
                                            <SelectTrigger className="w-full">
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
                                </div>

                                <div className="flex justify-between gap-4">
                                    <div className="w-full">
                                        <Label className="mb-2">Categories</Label>
                                        <div className="flex flex-col gap-1">
                                            <div>
                                                <MultiSelect
                                                    options={multiSelectCategories}
                                                    placeholder="Select categories..."
                                                    selected={addForm.data.categories}
                                                    onChange={(values) => addForm.setData('categories', values)}
                                                />
                                            </div>
                                            <div>
                                                {isAddingCategory ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="text"
                                                            value={newCategory}
                                                            onChange={(e) => setNewCategory(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleAddCategory();
                                                                }
                                                            }}
                                                            placeholder="Category name..."
                                                            autoFocus
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="h-7 px-2"
                                                            onClick={() => handleAddCategory()}
                                                        >
                                                            Add
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2"
                                                            onClick={() => setIsAddingCategory(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="h-7 px-2"
                                                        onClick={() => setIsAddingCategory(true)}
                                                    >
                                                        <Plus className="h-3 w-3" /> Add new category
                                                    </Button>
                                                )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
