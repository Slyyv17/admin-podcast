'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DotsLoader from '@/components/ui/loader';

interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImg: string;
  rssFeed: string;
}

export default function PodcastDetailPage() {
  const pathname = usePathname();
  const id = pathname?.split('/').pop();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchPodcast() {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcast/${id}`;
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view this podcast.');
          setLoading(false);
          return;
        }

        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Unauthorized. Please login.');
          } else {
            throw new Error('Failed to fetch podcast');
          }
        }

        const data = await res.json();
        setPodcast(data.podcast);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchPodcast();
  }, [id]);

  if (loading) return <DotsLoader />;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!podcast) return <p className="text-center mt-10 text-white">No podcast found.</p>;

  const isLongDescription = podcast.description.length > 200;

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const displayedDescription = showFullDescription
    ? podcast.description
    : podcast.description.slice(0, 200) + (isLongDescription ? '...' : '');

  return (
    <main className="min-h-screen bg-gray-900 text-white pry-ff">
      {/* Cover Image Hero Section */}
      <div
        className="relative w-full h-[32rem] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${podcast.coverImg})` }}
      >
        {/* Overlay with Backdrop Blur and Gradient */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b from-black/60 via-transparent to-black/70
            backdrop-blur-sm
            rounded-b-3xl
          "
        ></div>

        {/* Title Text */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-2xl">
            {podcast.title}
          </h1>
        </div>
      </div>

      {/* Description Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">About This Podcast</h2>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {displayedDescription}
          </p>
          {isLongDescription && (
            <button
              onClick={toggleDescription}
              className="mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none"
            >
              {showFullDescription ? 'Show Less' : 'See More'}
            </button>
          )}
        </div>
      </section>

      {/* RSS Feed Section */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gray-800 bg-opacity-60 p-6 rounded-xl shadow-lg backdrop-blur-md text-center">
          <a
            href={podcast.rssFeed}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-blue-400 hover:text-blue-300
              text-xl font-semibold underline
              transition-colors duration-300
            "
          >
            View RSS Feed
          </a>
        </div>
      </section>
    </main>
  );
}