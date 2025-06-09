// app/dashboard/podcast/layout.tsx
import React, { ReactNode } from 'react';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen w-full bg-[var(--bg-clr)] pry-ff py-10">
      {/* You can add shared UI here, like a header or sidebar */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-[var(--acc-clr)]">Podcast Dashboard</h1>
      </header>

      <main>{children}</main>
    </section>
  );
}