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
    id: number,
    image: string,
    gallery: string[],
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

interface productsPageProps { 
    products: product[],
    all_authors: { id: number; name: string }[],
    all_categories: string[]
}

export default function Index({ products, all_authors, all_categories }: productsPageProps) {

    const { auth } = usePage<SharedData>().props;

    const userRoles = auth.user.roles || [];
    const userPermissions = auth.user.permissions || [];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<product | null>(null);

    const duplicateData = useForm({ 
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

    const handleCreateClick = () => {
        router.get(route('products.create', {}));
    };

    const handleEditClick = (product: product) => {
        router.get(route('products.edit', { product: product.id }));
    };

    const handleDuplicateProduct = (product: product) => {
        duplicateData.setData({
            name: `${product.name} (Copy)`,
            regular_price: product.regular_price?.toString() || '',
            sale_price: product.sale_price?.toString() || '',
            stock: product.stock?.toString() || '',
            sku: `${product.sku}-copy`,
            tax_status: product.tax_status || '',
            tax_class: product.tax_class || '',
            description: product.description || '',
            author_id: product.author_id.toString(),
        });

        router.post(route('products.store'), {
            ...product,
            gallery: product.gallery,
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
        {
            accessorKey: 'image',
            header: 'Image',
            cell: ({ row, getValue }) => {

                const image_path = getValue<string>();

                return (
                    <div>
                        <img 
                            src={image_path ? `/storage/${image_path}` : '/placeholder.png'} 
                            width={50} 
                            className="rounded-sm" 
                        />
                    </div>
                )
            }
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ getValue }) => <span className="font-medium capitalize">{getValue<string>()}</span>,
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
        },
        {
            accessorKey: 'stock',
            header: 'Stock',
            cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span>,
        },
        {
            accessorKey: 'regular_price',
            header: 'Price',
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
                const author = all_authors.find(a => a.id === getValue<number>());
                return <span className="font-medium">{author ? author.name : 'N/A'}</span>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">

                    {userPermissions.includes('create products') && (
                        <Button 
                            variant="link"
                            size="sm"
                            className="p-0 text-green-600"
                            title="Duplicate Product"
                            onClick={() => handleDuplicateProduct(row.original)}
                        >
                            Duplicate
                        </Button>
                    )}

                    {userPermissions.includes('edit products') && (
                        <Button 
                            variant="link"
                            size="sm"
                            className="p-0 text-blue-600"
                            onClick={() => handleEditClick(row.original)}
                        >
                            Edit
                        </Button>
                    )}

                    {userPermissions.includes('delete products') && (
                        <Button 
                            variant="link"
                            size="sm"
                            className="p-0 text-red-600"
                            onClick={() => { 
                                setSelectedProduct(row.original); 
                                setIsDeleteProductOpen(true); 
                            }}
                        >
                            Delete
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
                            onClick={() => handleCreateClick()}
                            variant="brand"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add Product
                        </Button>
                    )}  

                </div>

                <div className="rounded-md border">
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
                                    <TableRow key={row.id} className="group">
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
                {products.length > 0 && (
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
                )}

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
