interface Episode {
    _id: string;
    title: string;
    createdAt: string;
    description: string;
    audio: string;
    coverImg: string;
  }
  
  interface RecentEpisodesProps {
    episodes: Episode[];
    isLoading: boolean;
  }
  
  export default function RecentEpisodes({ episodes, isLoading }: RecentEpisodesProps) {
    console.log('Episodes received in RecentEpisodes:', episodes);
  
    if (isLoading) {
      return <p>Loading...</p>; // or your loader
    }
  
    if (episodes.length === 0) {
      return <p className="text-sm text-[var(--sec-clr)]">No recent episodes found.</p>;
    }
  
        function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate();
      
        const getDaySuffix = (d: number) => {
          if (d >= 11 && d <= 13) return 'th';
          switch (d % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        };
      
        const suffix = getDaySuffix(day);
        const month = date.toLocaleString('default', { month: 'long' }); // 'May'
        const year = date.getFullYear();
      
        return `${day}${suffix} ${month} ${year}`;
      }
      
    return (
      <article className="space-y-6 flex flex-col items-start h-full">
        {episodes.map((episode) => (
          <div
            key={episode._id}
            className="w-full p-4 border border-[#1A1B1A] rounded-lg shadow bg-transparent"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {episode.coverImg && (
                <img
                  src={episode.coverImg}
                  alt={episode.title}
                  className="w-24 h-24 rounded object-cover"
                />
              )}
  
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--txt-clr)]">{episode.title}</h3>
                <p className="text-sm text-[var(--sec-clr)] mb-2">
                    {formatDate(episode.createdAt)} 
                </p>
                <p className="text-sm text-[var(--txt-clr)] mb-2">{episode.description}</p>
              </div>
            </div>
          </div>
        ))}
      </article>
    );
}  