'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DotsLoader from '@/components/ui/loader';
import Image from 'next/image';

interface Podcast {
  id: string;
  title: string;
  description: string;
  coverImg: string;
}

// Raw podcast data from backend (may have _id or id)
interface RawPodcast {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  coverImg: string;
}

export default function GetPodcast() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to view podcasts.');
      return;
    }

    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcast/get-podcasts`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch podcasts');
        const data = await res.json();

        const rawList = Array.isArray(data.podcasts) ? data.podcasts : data;
        const normalised: Podcast[] = rawList.map((p: RawPodcast) => ({
          id: p._id ?? p.id ?? '',
          title: p.title,
          description: p.description,
          coverImg: p.coverImg,
        }));

        setPodcasts(normalised);
        setMessage('');
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message || 'Unknown error');
        setMessage('Error fetching podcasts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <main className="w-full min-h-screen px-6 py-8 bg-[var(--bg-clr)] pry-ff">
      <h1 className="text-3xl font-bold mb-8 text-[var(--acc-clr)]">🎧 All Podcasts</h1>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <DotsLoader />
        </div>
      ) : message ? (
        <p className="text-center text-red-500 text-lg">{message}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {podcasts.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const truncated =
              item.description.length > 100 && !isExpanded
                ? item.description.slice(0, 100) + '…'
                : item.description;

            return (
              <Link
                href={`/dashboard/podcast/${item.id}`}
                key={item.id}
                className="group block bg-white/10 backdrop-blur rounded-xl border border-white/20
                           shadow-md hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
                           will-change-transform overflow-hidden"
              >
                <Image
                  width={500}
                  height={300}
                  src={item.coverImg}
                  alt={`Cover image for ${item.title}`}
                  className="w-full h-56 object-cover rounded-t-xl"
                  loading="lazy"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-3 line-clamp-2 group-hover:underline">
                    {item.title}
                  </h2>

                  <p className="text-sm text-[var(--txt-clr)] leading-relaxed">
                    {truncated}
                    {item.description.length > 100 && (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        className="ml-2 text-[var(--sec-clr)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--sec-clr)] rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedIndex(isExpanded ? null : index);
                        }}
                      >
                        {isExpanded ? 'See less' : 'See more'}
                      </button>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}