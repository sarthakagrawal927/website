import { getPostData, getSortedPostsData } from "../../../../lib/posts";

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }))
}


export default async function Page({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);
  return <div>My Post {params.slug}<div dangerouslySetInnerHTML={{ __html: postData.contentHTML as TrustedHTML }} /></div>;
}