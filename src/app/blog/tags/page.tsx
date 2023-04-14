import React from 'react';
import Link from 'next/link';
import { getAllTags } from '../../../../lib/posts';

export default async function Page() {
  const allTags = await getAllTags()
  return (
    <section className="px-20">
      <h1 className="text-4xl font-bold">Tags</h1>
      <ul className="mt-10">
        {allTags.map((tag) => (
          <li key={tag} className="text-2xl">
            <Link href={`/blog/tags/${tag}`}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}