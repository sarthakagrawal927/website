export type SlugParams = { params: { slug: string } }

export type Post = {
  id: string;
  date: string;
  title: string;
  tags: string[];
  slug: string;
}

export type FileMeta = {
  fileName: string;
  filePath: string;
}