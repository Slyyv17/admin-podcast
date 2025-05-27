'use client';

import { useEffect, useState } from "react";
import DotsLoader from "./ui/loader";
import RecentEpisodes from "./recentEpisodes"; // import the new component

interface Episode {
  _id: string;
  title: string;
  createdAt: string;
  description: string;
  audio: string;
  coverImg: string;
}

export default function Statistics() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [episodeCount, setEpisodeCount] = useState<number | null>(null);
  const [recentEpisodesData, setRecentEpisodesData] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [userRes, subRes, epRes, recentRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-num-users`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-num-subscribers`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/get-num-episodes`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/recent-episodes`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok || !subRes.ok || !epRes.ok || !recentRes.ok) {
          throw new Error('One or more requests failed');
        }

        const userData = await userRes.json();
        const subData = await subRes.json();
        const epData = await epRes.json();
        const recentData = await recentRes.json();
        console.log('Recent Episodes API response:', recentData);

        setUserCount(userData.count);
        setSubscriberCount(subData.subscribers);
        setEpisodeCount(epData.totalEpisodes);
        setRecentEpisodesData(recentData ?? []);
      } catch (error) {
        console.error('Unable to fetch data:', error);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-600 text-center mt-8">{error}</p>;
  }

  return (
    <main className="w-full p-6 pry-ff bg-black text-[var(--txt-clr)] overflow-hidden">
      {/* Stats Section */}
      <section className="w-full max-w-5xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-6 capitalize text-left">Statistics</h2>

        <article className="flex w-fit justify-start gap-6 p-2 border border-[#1A1B1A] rounded-xl shadow bg-transparent">
          {[
            { label: 'Total Users', value: isLoading ? <DotsLoader /> : userCount ?? '-', color: 'text-xl text-white' },
            { label: 'Subscribers', value: isLoading ? <DotsLoader /> : subscriberCount ?? '-', color: 'text-xl text-[#98BA9E]' },
            { label: 'Episodes', value: isLoading ? <DotsLoader /> : episodeCount ?? '-', color: 'text-xl text-white' }
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center justify-center min-w-[120px]">
              <div className={`${color} font-bold`}>{value}</div>
              <h3 className="text-sm mt-1">{label}</h3>
            </div>
          ))}
        </article>
      </section>

      {/* Episodes Section */}
      <section className="w-full max-w-5xl mx-auto border border-[#1A1B1A] rounded-xl p-6 bg-transparent">
        <h2 className="text-xl font-semibold mb-6 capitalize text-left">Recent Episodes</h2>

        <RecentEpisodes episodes={recentEpisodesData} isLoading={isLoading} />
      </section>
    </main>
  );
}