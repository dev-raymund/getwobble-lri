import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { usePage } from '@inertiajs/react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
    dashboard, 
    users, 
    roles_permissions,
    products,
    categories, 
    vendors,
    bookings,
    orders,
} from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    Archive,
    Calendar,
    Folder,
    LayoutDashboard,
    LayoutGrid, 
    ShoppingCart, 
    Unlock, 
    Users 
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: products(),
        icon: Archive,
        permission: [
            'view products',
        ], 
    },
    {
        title: 'Categories',
        href: categories(),
        icon: Folder,
        permission: [
            'view categories',
        ], 
    },
    {
        title: 'Vendors',
        href: vendors(),
        icon: Users,
        permission: [
            'view vendors',
        ], 
    },
    {
        title: 'Bookings',
        href: bookings(),
        icon: Calendar,
    },
    {
        title: 'Orders',
        href: orders(),
        icon: ShoppingCart,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Users',
        href: users(),
        icon: Users,
        permission: [
            'view users',
        ], 
    },
    {
        title: 'Roles - Permissions',
        href: roles_permissions(),
        icon: Unlock,
        permission: [
            'view role/permissions',
        ], 
    },
];

export function AppSidebar() {

    const { auth } = usePage().props as any;
    const userPermissions = auth.user.permissions || [];

    const filterNavItems = (items: NavItem[]) => {
        return items.filter((item) => {
            if (!item.permission) return true;

            // If it's an array, check if user has ANY of them (OR logic)
            if (Array.isArray(item.permission)) {
                return item.permission.some(p => userPermissions.includes(p));
            }

            // If it's a single string, check normally
            return userPermissions.includes(item.permission);
        });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filterNavItems(mainNavItems)} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filterNavItems(footerNavItems)} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
