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
    { name: 'Podcasts', href: '/dashboard/podcast', icon: Mic },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];