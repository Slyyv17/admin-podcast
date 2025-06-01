import UploadPodcast from './uploadPodcast';

export default function PodcastPage() {
  return (
    <main className="min-h-screen w-full bg-[#131313] overflow-auto py-10 px-4">
      <UploadPodcast />
    </main>
  );
}