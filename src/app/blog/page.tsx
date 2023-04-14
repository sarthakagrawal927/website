import React from 'react';
import { getSortedPostsData } from '../../../lib/posts';
import Link from 'next/link';

export default async function Page() {
  const allPostsData = await getSortedPostsData();
  return (
    <section className="px-20">
      <h2 className="px-10 fw-600">Blog</h2>
      <ul className="">
        {allPostsData.map(({ id, date, title, tags, slug }) => (
          <li className="" key={id}>
            <Link href={`blog/${slug}`}>
              {title}
            </Link>
            <br />
            {id}
            <br />
            {date}
            <br />
            {tags.map((tag) => <React.Fragment key={tag}>{tag}</React.Fragment>)}
          </li>
        ))}
      </ul>
    </section>
  );
}