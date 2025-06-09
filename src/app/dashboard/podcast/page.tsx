"use client"; // This is important since you want to use state

import { useState } from "react";
import Link from "next/link";
import GetPodcast from "./getPodcasts/getPodcast"; // adjust path if needed

export default function PodcastPage() {
  const [showPodcasts, setShowPodcasts] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--bg-clr)] flex flex-col items-center justify-center px-4 py-10">
      {!showPodcasts ? (
        <div className="flex flex-col sm:flex-row gap-6 pry-ff">
          <Link href="/dashboard/podcast/upload">
            <button className="bg-[var(--acc-clr)] text-[var(--txt-clr)] font-semibold px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              🎙 Create New Podcast
            </button>
          </Link>

          <button
            className="bg-gray-700 text-[var(--txt-clr)] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer"
            onClick={() => setShowPodcasts(true)}
          >
            📂 View All Podcasts
          </button>
        </div>
      ) : (
        <section className="w-full max-w-5xl">
          <button
            className="mb-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setShowPodcasts(false)}
          >
            ← Back
          </button>
          <GetPodcast />
        </section>
      )}
    </main>
  );
}