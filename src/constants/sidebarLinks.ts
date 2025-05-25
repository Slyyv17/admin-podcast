import {
    LayoutDashboard,
    Mic,
    BarChart,
    Users,
    Settings,
}
from 'lucide-react'

export const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Episodes', href: '/episodes', icon: Mic },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
];