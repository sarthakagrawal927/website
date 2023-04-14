import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, FileMeta } from './types';

const postsDirectory = path.join(process.cwd(), 'posts');

const getAllFiles = function (dirPath: string = postsDirectory, arrayOfFiles: FileMeta[] = []) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push({ fileName: file, filePath: dirPath })
    }
  })

  return arrayOfFiles
}

const getSlugByFilePath = (fullPath: string) => {
  const filePathArray = fullPath.split('/');
  const year = filePathArray[filePathArray.length - 3];
  const month = filePathArray[filePathArray.length - 2];
  // remove .md and check for different parts of the post on same date
  const date = filePathArray[filePathArray.length - 1].replace(/\.md$/, '');
  return `${year}-${month}-${date}`;
}

const getFilePathBySlug = (date: string) => {
  const dateArray = date.split('-');
  return path.join(postsDirectory, dateArray[0], dateArray[1], `${dateArray[2]}.md`);
}

const getFileDataByPath = async (fullPath: string, withContent: boolean = false) => {
  const slug = getSlugByFilePath(fullPath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  let contentHTML;
  if (withContent) {
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    contentHTML = processedContent.toString();
  }
  // Combine the data with the id
  return {
    id: fullPath,
    title: matterResult.data.title,
    tags: matterResult.data.tags,
    date: slug.split('P')[0],
    slug,
    contentHTML,
    ...matterResult.data,
  };
}

export async function getSortedPostsData() {
  const allFileMeta = getAllFiles();
  const allPostsData: Post[] = await Promise.all(allFileMeta.map(({ fileName, filePath }) => {
    const fullPath = path.join(filePath, fileName);
    return getFileDataByPath(fullPath);
  }));
  return allPostsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
}

export async function getAllTags() {
  const allPostsData = await getSortedPostsData();
  const allTags = allPostsData.reduce((acc: string[], { tags }) => {
    return [...acc, ...tags];
  }, []);
  return Array.from((new Set(allTags)).values());
}

export async function getPostsByTag(tag: string) {
  const allPostsData = await getSortedPostsData();
  return allPostsData.filter((post) => post.tags.includes(tag));
};

export function getPostDataBySlug(slug: string) {
  const filePath = getFilePathBySlug(slug);
  return getFileDataByPath(filePath, true);
}