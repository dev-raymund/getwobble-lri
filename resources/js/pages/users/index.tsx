import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Plus, Trash2, X, Loader2, Copy } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

type user = { 
    id: number,
    name: string,
    email: string,
    roles: string[],
    deleted_at: string | null
}

interface usersPageProps { 
    users: {
        data: user[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: any[];
    },
    counts: {
        all: number,
        published: number,
        trash: number
    },
    filters: {
        status: string | null
    },
    all_roles: string[]
}

export default function Index({ users, counts, filters, all_roles }: usersPageProps) {
    const { auth } = usePage<SharedData>().props;

    const userRoles = auth.user.roles || [];
    const userPermissions = auth.user.permissions || [];

    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<user | null>(null);
    const [selectedRole, setSelectedRole] = useState<{ userId: number; role: string } | null>(null);
    const [isAddingRoleToId, setIsAddingRoleToId] = useState<number | null>(null);

    const handleFilter = (status: string | null) => {
        router.get(route('users'), { status }, { preserveState: true });
    };

    const handleCreateClick = () => {
        router.get(route('users.create', {}));
    };

    const handleEditClick = (user: user) => {
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

    let columns: ColumnDef<user>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ getValue }) => <span className="font-medium capitalize">{getValue<string>()}</span>,
        },
        { accessorKey: 'email', header: 'Email' },
        {
            accessorKey: 'roles',
            header: 'Roles',
            cell: ({ row, getValue }) => {
                const roles = getValue<string[]>();
                const userId = row.original.id;
                const availableRoles = all_roles.filter(r => !roles.includes(r));
                return (
                    <div className="flex flex-wrap items-center gap-1">

                        {roles?.map((role, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                                {role}

                                {userPermissions.includes('edit users') && (
                                <button 
                                    onClick={() => { 
                                        setSelectedRole({ userId, role }); 
                                        setIsDeleteRoleOpen(true); 
                                    }} 
                                    className="hover:text-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                )}
                                
                            </span>
                        ))}

                        {availableRoles.length > 0 && userPermissions.includes('edit users') && (
                            isAddingRoleToId === userId ? (
                                <Select onValueChange={(val) => handleAddRole(userId, val)}>
                                    <SelectTrigger className="h-7 w-[130px] text-xs">
                                        <SelectValue placeholder="Add..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map(r => 
                                            <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6 rounded-full border-dashed" 
                                    onClick={() => setIsAddingRoleToId(userId)}
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
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {

                const isTrashed = row.original.deleted_at !== null;

                return (

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">

                        {isTrashed ? (
                            <>
                                {userPermissions.includes('edit users') && (
                                    <Button 
                                        variant="link" 
                                        className="p-0 text-green-600" 
                                        onClick={() => router.post(route('users.restore', row.original.id))}
                                    >
                                        Restore
                                    </Button>
                                )}

                                {userPermissions.includes('delete users') && (
                                    <Button 
                                        variant="link" 
                                        className="p-0 text-red-700 font-bold" 
                                        onClick={() => {/* Trigger Force Delete Modal */}}
                                    >
                                        Delete Permanently
                                    </Button>
                                )}

                            </>
                        ) : (

                            <>
                                {userPermissions.includes('edit users') && (
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="p-0 text-blue-600" 
                                        onClick={() => handleEditClick(row.original)}
                                    >
                                        Edit
                                    </Button>
                                )}

                                {userPermissions.includes('delete users') && (
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="p-0 text-red-600" 
                                        onClick={() => { 
                                            setSelectedUser(row.original); 
                                            setIsDeleteUserOpen(true); 
                                        }}
                                    >
                                        Trash
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                )
            },
        },
    ];

    // Hide actions column if user is not admin or super-admin
    const admins = ['super-admin', 'admin'];

    if (admins.every(role => !userRoles.includes(role))) {
        columns = columns.filter(col => col.id !== 'actions');
    }

    const handlePageChange = (page: number) => {
        router.get(route('users'), { 
            ...filters, 
            page: page 
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (value: string) => {
        router.get(route('users'), { 
            ...filters, 
            search: value 
        }, { preserveState: true, replace: true });
    };

    const table = useReactTable({
        data: users.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: users.last_page, 
        state: {
            pagination: {
                pageIndex: users.current_page - 1,
                pageSize: users.per_page,
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Input 
                        placeholder="Search Name or Email..." 
                        onChange={(e) => handleSearch(e.target.value)} 
                        className="max-w-sm" 
                    />

                    {userPermissions.includes('create users') && (
                        <Button 
                            onClick={() => handleCreateClick()} 
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add User
                        </Button>
                    )}

                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => handleFilter(null)} variant="link" size="sm" className="p-0 text-blue-600">
                        All ({counts.all})
                    </Button>
                    <Button onClick={() => handleFilter('published')} variant="link" size="sm" className="p-0 text-blue-600">
                        Published ({counts.published})
                    </Button>
                    <Button onClick={() => handleFilter('trash')} variant="link" size="sm" className="p-0 text-blue-600">
                        Bin ({counts.trash})
                    </Button>
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

                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing {users.data.length} of {users.total} users
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(users.current_page - 1)}
                            disabled={users.current_page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(users.current_page + 1)}
                            disabled={users.current_page >= users.last_page}
                        >
                            Next
                        </Button>
                    </div>
                </div>

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

