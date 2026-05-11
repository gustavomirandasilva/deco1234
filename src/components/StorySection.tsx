"use client";

import { useEffect, useState } from "react";

type Story = {
  id: string;
  title: string;
  content: string;
  category: string;
  isActive?: boolean;
};

function categoryLabel(category: string) {
  if (category === "ORIENTAL_LUXURY") return "Luxo Oriental";
  if (category === "GREAT_BRANDS") return "Grandes Grifes";
  return "Curiosidade";
}

export default function StorySection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data: Story[]) => {
        if (!Array.isArray(data)) return;
        setStories(data.filter((s) => s.isActive));
      })
      .catch(() => setStories([]));
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold">Universo da Perfumaria</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stories.map((story) => {
            const expanded = expandedId === story.id;
            return (
              <div
                key={story.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
                  {categoryLabel(story.category)}
                </span>
                <h3 className="mb-3 text-lg font-bold">{story.title}</h3>
                <p
                  className={`text-sm leading-relaxed text-gray-600 ${
                    expanded ? "" : "line-clamp-4"
                  }`}
                >
                  {story.content}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId((id) => (id === story.id ? null : story.id))
                  }
                  className="mt-4 text-sm font-semibold underline decoration-amber-500"
                >
                  {expanded ? "Ver menos" : "Ler mais"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
