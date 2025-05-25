'use client';

import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants/sidebarLinks';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-black text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-8">LarksPod</h2>
        <nav className="space-y-2">
          {sidebarLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                pathname === href ? 'bg-red-800 text-white' : 'text-gray-300 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-sm">N</span>
        </div>
      </div>
    </aside>
  );
}
