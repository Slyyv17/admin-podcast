export default function Statistics() {
    return (
      <main className="w-full min-h-screen p-6 pry-ff bg-transparent text-[var(--txt-clr)]">
        
        {/* Stats Section */}
        <section className="w-full max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6 capitalize text-left">Statistics</h2>
  
          <article className="flex w-fit justify-start gap-6 p-6 border border-[#1A1B1A] rounded-xl shadow bg-transparent">
            {[
              { label: 'Total Users', value: 1000, color: 'text-xl text-white' },
              { label: 'Subscribers', value: 800, color: 'text-xl text-[#98BA9E]' },
              { label: 'Episodes', value: 600, color: 'text-xl text-white' }
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center justify-center min-w-[120px]">
                <p className={`${color} font-bold`}>{value}</p>
                <h3 className="text-sm mt-1">{label}</h3>
              </div>
            ))}
          </article>
        </section>
  
        {/* Episodes Section */}
        <section className="w-full max-w-5xl mx-auto border border-[#1A1B1A] rounded-xl p-6 bg-transparent">
          <h2 className="text-2xl font-semibold mb-6 capitalize text-left">Recent Episodes</h2>
  
          <article className="space-y-6 flex flex-col items-start">
            {[
              {
                title: 'Episode 1: The Beginning',
                date: '2023-10-01'
              },
              {
                title: 'Episode 2: The Journey Continues',
                date: '2023-10-15'
              }
            ].map(({ title, date }) => (
              <div
                key={title}
                className="bg-transparent flex flex-col items-start rounded-md w-full"
              >
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-[var(--sec-clr)] mt-1">Released on: {date}</p>
              </div>
            ))}
          </article>
        </section>
      </main>
    );
}
  