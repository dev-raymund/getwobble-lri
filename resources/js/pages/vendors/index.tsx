import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Plus, Trash2, X, Loader2, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Vendors', href: '/vendors' }];

type vendor = { 
    id: number,
    name: string,
    email: string,
}

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

interface vendorsPageProps { 
    vendors: vendor[]
}

export default function Index({ vendors }: vendorsPageProps) {

    const { auth } = usePage<SharedData>().props;

    const userRoles = auth.user.roles || [];
    const userPermissions = auth.user.permissions || [];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<vendor | null>(null);
    const [selectedRole, setSelectedRole] = useState<{ userId: number; role: string } | null>(null);
    const [isAddingRoleToId, setIsAddingRoleToId] = useState<number | null>(null);

    const handleCreateClick = () => {
        router.get(route('users.create', {}));
    };

    const handleViewProductsClick = (user: vendor) => {
        router.get(route('products.vendor', {user: user.id}));
    };

    const handleEditClick = (user: vendor) => {
        router.get(route('users.edit', { user: user.id }));
    };

    const confirmDeleteUser = () => {
        if (selectedUser) {
            router.delete(
                route('users.destroy', { 
                    user: selectedUser.id 
                }), {
                    onSuccess: () => setIsDeleteUserOpen(false)
                }
            );
        }
    };

    const handleAddRole = (userId: number, roleName: string) => {
        router.post(
            route('users.roles.store', { 
                user: userId 
            }), { 
                role: roleName 
            }, {
                onSuccess: () => setIsAddingRoleToId(null)
            }
        );
    };

    const confirmDeleteRole = () => {
        if (selectedRole) {
            router.delete(
                route('users.roles.revoke', { 
                    user: selectedRole.userId, 
                    role: selectedRole.role 
                }), {
                    onSuccess: () => setIsDeleteRoleOpen(false)
                }
            );
        }
    };

    let columns: ColumnDef<vendor>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ getValue }) => <span className="font-medium capitalize">{getValue<string>()}</span>,
        },
        { accessorKey: 'email', header: 'Email' },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <div className=''>
                    <Switch />
                </div>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">

                    {userPermissions.includes('edit vendors') && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                            <Button 
                                variant="link"
                                size="sm"
                                className="p-0 text-blue-600"
                                onClick={() => handleEditClick(row.original)}
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="link"
                                size="sm"
                                className="p-0 text-blue-600"
                                onClick={() => handleViewProductsClick(row.original)}
                            >
                                Products
                            </Button>
                            <Button 
                                variant="link"
                                size="sm"
                                className="p-0 text-blue-600"
                            >
                                Orders
                            </Button>
                        </div>
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
        data: vendors,
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
            <Head title="Vendors" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Input 
                        placeholder="Search..." 
                        value={globalFilter ?? ""} 
                        onChange={(e) => setGlobalFilter(e.target.value)} 
                        className="max-w-sm" 
                    />

                    {userPermissions.includes('create users') && (
                        <Button 
                            onClick={() => handleCreateClick()} 
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Create User
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
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {vendors.length > 0 && (
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

                {/* MODAL: DELETE USER */}
                <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the user account for {selectedUser?.name}.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeleteUser} 
                                className="bg-red-600"
                            >
                                Delete User
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL: REMOVE ROLE */}
                <AlertDialog open={isDeleteRoleOpen} onOpenChange={setIsDeleteRoleOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Role?</AlertDialogTitle>
                            <AlertDialogDescription>Remove the "{selectedRole?.role}" role from this user?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeleteRole} 
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

