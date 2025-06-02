'use client';

import { useState, useEffect } from "react";
import DotsLoader from "@/components/ui/loader";

interface Podcast {
  title: string;
  description: string;
  coverImg: string;
}

export default function GetPodcast() {
  const [podcast, setPodcast] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('You must be logged in to upload a podcast.');
      return;
    }

    const fetchPodcast = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/podcast/get-podcasts`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch podcasts');
        }

        const data = await response.json();
        if (Array.isArray(data.podcasts)) {
          setPodcast(data.podcasts);
        } else if (Array.isArray(data)) {
          setPodcast(data);
        } else {
          setMessage("Unexpected data format from server.");
        }
        setMessage('');
      } catch (error: any) {
        console.error('Error fetching podcast:', error.message);
        setMessage('Error fetching podcast.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcast();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <main className="w-full min-h-screen px-6 py-8 bg-[var(--bg-clr)] pry-ff">
      <h1 className="text-3xl font-bold mb-6 text-[var(--acc-clr)]">🎧 All Podcasts</h1>

      {isLoading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
            <DotsLoader />
        </div>
      ) : message ? (
        <p className="text-red-500">{message}</p>
      ) : Array.isArray(podcast) ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 shadow-lg">
          {podcast.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const shouldTruncate = item.description.length > 100;
            const displayText = isExpanded || !shouldTruncate
              ? item.description
              : item.description.slice(0, 100) + '...';

            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-500 border border-white/10 cursor-pointer hover:scale-105"
              >
                <img
                  src={item.coverImg}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[var(--acc-clr)] mb-2">{item.title}</h2>
                  <p className="text-sm text-[var(--txt-clr)] mb-1">
                    {displayText}
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-[var(--sec-clr)] hover:underline ml-1 cursor-pointer"
                      >
                        {isExpanded ? 'See less' : 'See more'}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-red-500">Invalid podcast data.</p>
      )}
    </main>
  );
}