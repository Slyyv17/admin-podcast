// app/dashboard/podcast/layout.tsx
import React, { ReactNode } from 'react';

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen w-full bg-[var(--bg-clr)] pry-ff py-10">
      {/* You can add shared UI here, like a header or sidebar */}

      <main>{children}</main>
    </section>
  );
}