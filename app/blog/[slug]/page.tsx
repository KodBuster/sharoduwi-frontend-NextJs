import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostContent } from "@/components/BlogPostContent";
import { InfoPageShell } from "@/components/InfoPageShell";
import { JsonLd } from "@/components/JsonLd";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  toJsonLdGraph,
} from "@/lib/seo/schema";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Статья не найдена",
      path: `/blog/${slug}`,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogType: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const schema = toJsonLdGraph(
    buildBreadcrumbSchema([
      { name: "Главная", path: "/" },
      { name: "Полезное", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    buildBlogPostingSchema(post)
  );

  return (
    <>
      <JsonLd data={schema} />
      <InfoPageShell>
        <BlogPostContent post={post} />
      </InfoPageShell>
    </>
  );
}
