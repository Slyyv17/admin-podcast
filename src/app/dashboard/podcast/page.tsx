import Link from 'next/link';

export default function PodcastPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--bg-clr)] flex items-center justify-center px-4 py-10">
      <div className="flex flex-col sm:flex-row gap-6 pry-ff">
        
        <Link href="/dashboard/podcast/upload">
          <button className="bg-[var(--acc-clr)] text-[var(--txt-clr)] font-semibold px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
            🎙 Create New Podcast
          </button>
        </Link>

        <Link href="/dashboard/podcast/getPodcasts">
          <button className="bg-gray-700 text-[var(--txt-clr)] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer">
            📂 View All Podcasts
          </button>
        </Link>

      </div>
    </main>
  );
}