import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Plus, Trash2, X, Loader2, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/products' }];

type product = { 
    id: number; 
    name: string; 
    price: number; 
    stock: number; 
    description: string;
    categories: string[]; 
    author_id: number;
};

interface productsPageProps { 
    products: product[]; 
    authors: { id: number; name: string }[];
    all_categories: string[];
};

export default function Index({ products, authors, all_categories }: productsPageProps) {

    const { auth } = usePage<SharedData>().props;

    const userRoles = auth.user.roles || [];
    const userPermissions = auth.user.permissions || [];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<product | null>(null);

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
    });

    const editForm = useForm({ 
        id: 0, 
        name: '', 
        regular_price: '', 
        sale_price: '',
        stock: '',
        sku: '',
        tax_status: '',
        tax_class: '',
        description: '',
        author_id: '',
    });

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(
            route('products.store'), {
                onSuccess: () => { 
                    setIsAddDialogOpen(false); 
                    addForm.reset(); 
                }
            }
        );
    };

    useEffect(() => {
        if (isAddDialogOpen && auth.user) {
            addForm.setData('author_id', auth.user.id.toString());
        }
    }, [isAddDialogOpen]);

    const handleEditClick = (product: product) => {
        editForm.setData({ 
            id: product.id, 
            name: product.name, 
            regular_price: (product as any).regular_price,
            sale_price: (product as any).sale_price,
            stock: (product as any).stock,
            sku: (product as any).sku,
            tax_status: (product as any).tax_status,
            tax_class: (product as any).tax_class,
            description: (product as any).description,
            author_id: (product as any).author_id?.toString() || "", 
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(
            route('products.update', { 
                product: editForm.data.id 
            }), {
                onSuccess: () => setIsEditDialogOpen(false)
            }
        );
    };

    const handleDuplicateProduct = (product: product) => {
        addForm.setData({
            name: `${product.name} (Copy)`,
            regular_price: (product as any).regular_price?.toString() || '',
            sale_price: (product as any).sale_price?.toString() || '',
            stock: (product as any).stock?.toString() || '',
            sku: `${(product as any).sku}-copy`,
            tax_status: (product as any).tax_status || '',
            tax_class: (product as any).tax_class || '',
            description: (product as any).description || '',
            author_id: product.author_id.toString(),
        });

        router.post(route('products.store'), {
            ...product,
            name: `${product.name} (Copy)`,
            sku: `${(product as any).sku}-copy`,
            author_id: product.author_id
        });
    };

    const confirmDeleteProduct = () => {
        if (selectedProduct) {
            router.delete(
                route('products.destroy', { 
                    product: selectedProduct.id 
                }), {
                    onSuccess: () => setIsDeleteProductOpen(false)
                }
            );
        }
    };

    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ productId: number; category: string } | null>(null);
    const [isAddingCategoryToId, setIsAddingCategoryToId] = useState<number | null>(null);

    const handleAddCategory = (productId: number, categoryName: string) => {
        router.post(
            route('products.categories.store', { 
                product: productId
            }), { 
                category: categoryName 
            }, {
                onSuccess: () => setIsAddingCategoryToId(null)
            }
        );
    };

    const confirmDeleteCategory = () => {
        if (selectedCategory) {
            router.delete(
                route('products.categories.revoke', { 
                    product: selectedCategory.productId, 
                    category: selectedCategory.category 
                }), {
                    onSuccess: () => setIsDeleteCategoryOpen(false)
                }
            );
        }
    };

    let columns: ColumnDef<product>[] = [
        { accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'name',
            header: 'Product Name',
            cell: ({ getValue }) => <span className="font-medium capitalize">{getValue<string>()}</span>,
        },
        {
            accessorKey: 'regular_price',
            header: 'Regular Price',
            cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span>,
        },
        {
            accessorKey: 'sale_price',
            header: 'Sale Price',
            cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span>,
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
            cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span>,
        },
        {
            accessorKey: 'categories',
            header: 'Categories',
            cell: ({ row, getValue }) => {
                const categories = getValue<string[]>();
                const productId = row.original.id;
                const availableCategories = all_categories.filter(r => !categories.includes(r));
                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {categories?.map((category, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                                {category}

                                {userPermissions.includes('edit products') && (
                                    <button 
                                        onClick={() => { 
                                            setSelectedCategory({ productId, category }); 
                                            setIsDeleteCategoryOpen(true); 
                                        }} 
                                        className="hover:text-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}

                            </span>
                        ))}
                        {availableCategories.length > 0 && userPermissions.includes('edit products') && (
                            isAddingCategoryToId === productId ? (
                                <Select onValueChange={(val) => handleAddCategory(productId, val)}>
                                    <SelectTrigger className="h-7 w-[130px] text-xs">
                                        <SelectValue placeholder="Add..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCategories.map(r =>
                                            <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full border-dashed" 
                                    onClick={() => setIsAddingCategoryToId(productId)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            )
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'author_id',
            header: 'Author',
            cell: ({ getValue }) => { 
                const author = authors.find(a => a.id === getValue<number>());
                return <span className="font-medium">{author ? author.name : 'N/A'}</span>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">

                    {userPermissions.includes('create products') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600" 
                            title="Duplicate Product"
                            onClick={() => handleDuplicateProduct(row.original)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}

                    {userPermissions.includes('edit products') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600" 
                            onClick={() => handleEditClick(row.original)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}

                    {userPermissions.includes('delete products') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600" 
                            onClick={() => { 
                                setSelectedProduct(row.original); 
                                setIsDeleteProductOpen(true); 
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}

                </div>
            ),
        },
    ];

    // Hide actions column if user is not admin or super-admin
    const admins = ['super-admin', 'admin'];

    if (admins.every(role => !userRoles.includes(role))) {
        columns = columns.filter(col => col.id !== 'actions');
    }

    const table = useReactTable({
        data: products,
        columns,
        state: { sorting, globalFilter },
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
        autoResetPageIndex: false, 
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Input 
                        placeholder="Search..." 
                        value={globalFilter ?? ""} 
                        onChange={(e) => setGlobalFilter(e.target.value)} 
                        className="max-w-sm" 
                    />

                    {userPermissions.includes('create products') && (
                        <Button 
                            onClick={() => setIsAddDialogOpen(true)} 
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    )}

                </div>

                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={header.column.getCanSort() ? 'flex items-center cursor-pointer select-none' : ''}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    
                                                    {header.column.getCanSort() && (
                                                        <span className="ml-2">
                                                            {{
                                                                asc: <ArrowUp className="h-4 w-4" />,
                                                                desc: <ArrowDown className="h-4 w-4" />,
                                                            }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4 opacity-50" />}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell 
                                                key={cell.id}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell 
                                        colSpan={columns.length} 
                                        className="h-24 text-center"
                                    >
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* MODAL: ADD PRODUCT */}
                <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <AlertDialogContent className="min-w-4/5">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add New Product</AlertDialogTitle>
                        </AlertDialogHeader>

                        <form id="add-form" onSubmit={handleAddProduct} className="space-y-4 py-2">
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
                                        {authors.map((author) => (
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
                            
                        </form>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button 
                                type="submit" 
                                form="add-form" 
                                disabled={addForm.processing} 
                                className="bg-blue-600"
                            >
                                {addForm.processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Add Product
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL: EDIT PRODUCT */}
                <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <AlertDialogContent className="min-w-4/5">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Product Details</AlertDialogTitle>
                        </AlertDialogHeader>
                        <form id="edit-form" onSubmit={handleUpdateProduct} className="space-y-4 py-2">
                            <div>
                                <Label className="mb-2">Name</Label>
                                <Input 
                                    value={editForm.data.name} 
                                    onChange={e => editForm.setData('name', e.target.value)} 
                                />
                                {editForm.errors.name && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {editForm.errors.name}
                                    </p>
                                }
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/3">
                                    <Label className="mb-2">Regular Price</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.regular_price} 
                                        onChange={e => editForm.setData('regular_price', e.target.value)} 
                                    />
                                    {editForm.errors.regular_price && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.regular_price}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/3">
                                    <Label className="mb-2">Sale Price</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.sale_price} 
                                        onChange={e => editForm.setData('sale_price', e.target.value)} 
                                    />
                                    {editForm.errors.sale_price && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.sale_price}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/3">
                                    <Label className="mb-2">Stock</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.stock} 
                                        onChange={e => editForm.setData('stock', e.target.value)} 
                                    />
                                    {editForm.errors.stock && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.stock}
                                        </p>
                                    }
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-1/3">
                                    <Label className="mb-2">SKU</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.sku} 
                                        onChange={e => editForm.setData('sku', e.target.value)} 
                                    />
                                    {editForm.errors.sku && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.sku}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/3">
                                    <Label className="mb-2">Tax Status</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.tax_status} 
                                        onChange={e => editForm.setData('tax_status', e.target.value)} 
                                    />
                                    {editForm.errors.tax_status && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.tax_status}
                                        </p>
                                    }
                                </div>

                                <div className="w-1/3">
                                    <Label className="mb-2">Tax Class</Label>
                                    <Input 
                                        type="number"
                                        value={editForm.data.tax_class} 
                                        onChange={e => editForm.setData('tax_class', e.target.value)} 
                                    />
                                    {editForm.errors.tax_class && 
                                        <p className="text-xs text-red-500 mt-1">
                                            {editForm.errors.tax_class}
                                        </p>
                                    }
                                </div>

                            </div>

                            <div>
                                <Label className="mb-2">Description</Label>
                                <Textarea 
                                    value={editForm.data.description} 
                                    onChange={e => editForm.setData('description', e.target.value)} 
                                />
                                {editForm.errors.description && 
                                    <p className="text-xs text-red-500 mt-1">
                                        {editForm.errors.description}
                                    </p>
                                }
                            </div>

                            <div>
                                <Label className="mb-2">Author</Label>
                                <Select 
                                    value={editForm.data.author_id} 
                                    onValueChange={(val) => editForm.setData('author_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authors.map((author) => (
                                            <SelectItem key={author.id} value={author.id.toString()}>
                                                {author.name} {author.id === auth.user.id && "(You)"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editForm.errors.author_id && 
                                    <p className="text-red-500 text-xs">
                                    {editForm.errors.author_id}
                                    </p>
                                }
                            </div>
                            
                        </form>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button 
                                type="submit" 
                                form="edit-form" 
                                disabled={editForm.processing} 
                                className="bg-blue-600"
                            >
                                {editForm.processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL: DELETE PRODUCT */}
                <AlertDialog open={isDeleteProductOpen} onOpenChange={setIsDeleteProductOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the product.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeleteProduct} 
                                className="bg-red-600"
                            >
                                Delete Product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL: REMOVE CATEGORY */}
                <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Category?</AlertDialogTitle>
                            <AlertDialogDescription>Remove the "{selectedCategory?.category}" category from this product?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeleteCategory} 
                                className="bg-red-600"
                            >
                                Remove
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </AppLayout>
    );
}
