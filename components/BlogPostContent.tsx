import Link from "next/link";

import { formatBlogDate, type BlogPost } from "@/lib/blog";

export function BlogPostContent({ post }: { post: BlogPost }) {
  return (
    <>
      <section className="sec info-page">
        <div className="wrap">
          <nav className="category-breadcrumb reveal" aria-label="Навигация">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Полезное</Link>
            <span aria-hidden="true">/</span>
            <span>{post.title}</span>
          </nav>

          <article className="blog-article reveal">
            <div className="sec-tag">
              <span className="dot" /> Статья
            </div>
            <h1>{post.title}</h1>
            <div className="blog-article-meta">
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} мин чтения</span>
            </div>
            <p className="blog-article-lead">{post.description}</p>

            <div className="blog-article-body">
              {post.sections.map((section, index) => (
                <section key={index}>
                  {section.heading ? <h2>{section.heading}</h2> : null}
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            {post.relatedLinks.length > 0 && (
              <aside className="blog-related">
                <h2>Смотрите также</h2>
                <div className="info-chips">
                  {post.relatedLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="chip">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </aside>
            )}

            <div className="blog-article-cta">
              <p>Готовы заказать? Поможем подобрать шары и доставку.</p>
              <div className="info-cta-actions">
                <Link href="/catalog" className="btn btn-primary">
                  Каталог
                </Link>
                <a href="tel:+79267086374" className="btn btn-ghost">
                  Позвонить
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
