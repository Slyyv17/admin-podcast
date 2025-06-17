'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
export default function EpisodeBtn() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname?.split('/').pop();

  const handleClick = () => {
    if (id) {
      router.push(`/podcast/${id}/new-episode`);
    }
  };

  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="absolute bottom-6 right-6 z-50 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
    >
      New Episode
      <Plus size={16} />
    </button>
  );
}