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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/categories' }];

type category = { 
    id: number,
    name: string,
    description: string
}

interface categoriesPageProps { 
    categories: category[]
}

export default function Index({ categories }: categoriesPageProps) {

    const { auth } = usePage<SharedData>().props;
    
    const userRoles = auth.user.roles || [];
    const userPermissions = auth.user.permissions || [];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<category | null>(null);

    const addForm = useForm({ 
        name: '', 
        description: '',
    });

    const editForm = useForm({ 
        id: 0, 
        name: '', 
        description: '',
    });

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(
            route('categories.store'), {
                onSuccess: () => { 
                    setIsAddDialogOpen(false); 
                    addForm.reset(); 
                }
            }
        );
    };

    const handleEditClick = (category: category) => {
        editForm.setData({ 
            id: category.id, 
            name: category.name, 
            description: (category as any).description,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(
            route('categories.update', { 
                category: editForm.data.id 
            }), {
                onSuccess: () => setIsEditDialogOpen(false)
            }
        );
    };

    const handleDuplicateCategory = (category: category) => {
        addForm.setData({
            name: `${category.name} (Copy)`,
            description: (category as any).description || '',
        });

        router.post(route('categories.store'), {
            ...category,
            name: `${category.name} (Copy)`,
        });
    };

    const confirmDeleteCategory = () => {
        if (selectedCategory) {
            router.delete(
                route('categories.destroy', { 
                    category: selectedCategory.id 
                }), {
                    onSuccess: () => setIsDeleteCategoryOpen(false)
                }
            );
        }
    };


    let columns: ColumnDef<category>[] = [
        { accessorKey: 'id', header: 'ID' },
        {
            accessorKey: 'name',
            header: 'Category Name',
            cell: ({ getValue }) => <span className="font-medium capitalize">{getValue<string>()}</span>,
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">

                    {userPermissions.includes('create categories') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600" 
                            title="Duplicate Product"
                            onClick={() => handleDuplicateCategory(row.original)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}

                    {userPermissions.includes('edit categories') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600" 
                            onClick={() => handleEditClick(row.original)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}

                    {userPermissions.includes('delete categories') && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600" 
                            onClick={() => { 
                                setSelectedCategory(row.original); 
                                setIsDeleteCategoryOpen(true); 
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
        data: categories,
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
            <Head title="Categories" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Input 
                        placeholder="Search..." 
                        value={globalFilter ?? ""} 
                        onChange={(e) => setGlobalFilter(e.target.value)} 
                        className="max-w-sm" 
                    />

                    {userPermissions.includes('create categories') && (
                        <Button 
                            onClick={() => setIsAddDialogOpen(true)} 
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add Category
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
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {categories.length > 0 && (
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

                {/* MODAL: ADD CATEGORY */}
                <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add New Category</AlertDialogTitle>
                        </AlertDialogHeader>

                        <form id="add-form" onSubmit={handleAddCategory} className="space-y-4 py-2">
                            <div>
                                <Label className="mb-2">Category Name</Label>
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
                                Add Category
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL: EDIT CATEGORY */}
                <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Category Details</AlertDialogTitle>
                        </AlertDialogHeader>
                        <form id="edit-form" onSubmit={handleUpdateCategory} className="space-y-4 py-2">
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

                {/* MODAL: DELETE CATEGORY */}
                <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the category.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeleteCategory} 
                                className="bg-red-600"
                            >
                                Delete Product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </AppLayout>
    );
}
