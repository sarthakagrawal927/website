import { getPostDataBySlug, getSortedPostsData } from "../../../../lib/posts";
import { SlugParams } from "../../../../lib/types";

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }: SlugParams) {
  const postData = await getPostDataBySlug(params.slug);
  return <div>My Post {params.slug}<div dangerouslySetInnerHTML={{ __html: postData.contentHTML as TrustedHTML }} /></div>;
}