'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getBlogBySlug, blogPosts } from '../blog-data';
import { notFound } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="font-serif text-2xl md:text-3xl mt-12 mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="font-serif text-xl md:text-2xl mt-10 mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bold text within paragraphs
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p
            key={index}
            className="font-semibold text-lg mt-6 mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      // List items
      if (line.startsWith('- ')) {
        return (
          <li
            key={index}
            className="ml-6 mb-2 list-disc"
            style={{ color: 'var(--text-secondary)' }}
          >
            {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      // Numbered list items
      if (/^\d+\.\s/.test(line)) {
        return (
          <li
            key={index}
            className="ml-6 mb-2 list-decimal"
            style={{ color: 'var(--text-secondary)' }}
          >
            {line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      // Regular paragraphs
      return (
        <p
          key={index}
          className="text-lg leading-relaxed mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      {/* Article Header */}
      <article className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>&larr;</span>
            <span>Back to Articles</span>
          </Link>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: 'var(--brand-100)',
                color: 'var(--brand-700)'
              }}
            >
              {post.category}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            className="text-xl mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {post.excerpt}
          </p>

          {/* Author */}
          <div
            className="flex items-center gap-3 pb-8 mb-8"
            style={{ borderBottom: '1px solid var(--border-soft)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
              style={{
                background: 'var(--brand-100)',
                color: 'var(--brand-700)'
              }}
            >
              {post.author.charAt(0)}
            </div>
            <div>
              <p
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {post.author}
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                Relationship Science Writer
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="prose-content">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          <div
            className="mt-12 pt-8"
            style={{ borderTop: '1px solid var(--border-soft)' }}
          >
            <p
              className="text-sm font-medium mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Topics covered:
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: 'var(--bg-muted)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div
            className="mt-8 p-6 rounded-2xl"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <p
              className="font-medium mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Research Sources:
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <a
                  href="https://www.hubermanlab.com/episode/the-science-of-love-desire-and-attachment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--brand-600)' }}
                >
                  Huberman Lab: The Science of Love, Desire and Attachment
                </a>
              </li>
              <li>
                <a
                  href="https://hubermanlab.com/science-of-social-bonding-in-family-friendship-and-romantic-love/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--brand-600)' }}
                >
                  Huberman Lab: Science of Social Bonding
                </a>
              </li>
              <li>
                <a
                  href="https://ifstudies.org/blog/jordan-petersons-radical-take-on-marriage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--brand-600)' }}
                >
                  Institute for Family Studies: Jordan Peterson on Marriage
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section
          className="py-16 px-4"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="font-serif text-2xl mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="matcha-card p-6 block group"
                >
                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {relatedPost.readTime} min read
                  </span>
                  <h3
                    className="font-serif text-xl mt-2 mb-3 group-hover:text-[var(--brand-600)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {relatedPost.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-serif text-2xl md:text-3xl mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to Transform Your Relationships?
          </h2>
          <p
            className="mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Apply the science of connection with our guided 21-day program.
          </p>
          <Link
            href="/app"
            className="matcha-btn matcha-btn-primary inline-flex"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
