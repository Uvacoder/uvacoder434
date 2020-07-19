import * as React from "react";
import Link from "next/link";
import Head from "next/head";
import { NotionRenderer, BlockMapType } from "react-notion";
import { config } from "../../config";

import TwitterIcon from "../../assets/svgs/twitter.svg";

import { getBlogTable, getPageBlocks, getPageViews } from "../../core/blog";
import { dateFormatter } from "../../core/utils";
import { Post } from "../../types/blog";
import { GetStaticProps, GetStaticPaths } from "next";
import { Nav } from "../../components/sections/nav";
import { Footer } from "../../components/sections/footer";

interface PostProps {
  blocks: BlockMapType;
  post: Post;
  postViewCount: number;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const table = await getBlogTable<Post>(config.notionBlogTableId);
  return {
    paths: table.filter(row => row.published).map(row => `/blog/${row.slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  PostProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    throw Error("No slug given");
  }

  const table = await getBlogTable<Post>(config.notionBlogTableId);

  const post = table.find(t => t.slug === slug);

  if (!post || (!post.published && process.env.NODE_ENV !== "development")) {
    throw Error(`Failed to find post for slug: ${slug}`);
  }

  const blocks = await getPageBlocks(post.id);
  const postViewCount = await getPageViews(slug);

  return {
    props: {
      post,
      postViewCount,
      blocks,
    },
    unstable_revalidate: 10,
  };
};

const BlogPost: React.FC<PostProps> = ({ post, postViewCount, blocks }) => {
  if (!post) return null;

  return (
    <>
      {/* <CustomHead title={post.page} description={post.preview} /> */}
      <Head>
        <meta name="date" content={new Date(post.date).toDateString()} />
      </Head>
      <Nav />

      <div className="mt-8 mb-12 md:mt-12 md:mb-18 px-4">
        <h1 className="text-2xl md:text-3xl font-bold sm:text-center mb-2">
          {post.title}
        </h1>
        <div className="sm:text-center text-gray-600">
          <time dateTime={new Date(post.date).toISOString()}>
            {dateFormatter.format(new Date(post.date))}
          </time>
          {" / "}
          <span>{postViewCount || "..."} Views</span>
          {" / "}
          <Link href="/blog">
            <a className="text-blue-500">Blog</a>
          </Link>
        </div>
      </div>
      <article className="flex-1 w-full max-w-3xl mx-auto px-4">
        <NotionRenderer blockMap={blocks} />
      </article>
      <div className="my-8 w-full max-w-3xl mx-auto px-4">
        <div className="py-6 my-2 border-t flex items-end">
          <div>
            <div className="font-semibold">Timo Lins</div>
            <div>
              <a className="inline-block" href="https://twitter.com/timolins">
                <TwitterIcon className="w-6 -ml-1 text-gray-500 hover:text-gray-600 transition-colors duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default BlogPost;
