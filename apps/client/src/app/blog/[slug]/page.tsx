'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getBlogBySlug, blogPosts } from '../blog-data';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GoldRect, GrainOverlay, artisticStyles, PaintSplatter, ArtisticFooter } from '@/components/ui/ArtisticElements';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = getBlogBySlug(slug);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // Simple markdown-like rendering with Navy/Gold theme
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="heading-serif text-2xl md:text-3xl font-light mt-12 mb-6"
            style={{ color: 'var(--navy)' }}
          >
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            className="heading-serif text-xl md:text-2xl font-light mt-10 mb-4"
            style={{ color: 'var(--navy)' }}
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
            style={{ color: 'var(--navy)' }}
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
            style={{ color: 'var(--navy)', opacity: 0.7 }}
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
            style={{ color: 'var(--navy)', opacity: 0.7 }}
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
          style={{ color: 'var(--navy)', opacity: 0.7, lineHeight: 1.8 }}
        >
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <>
      <style jsx global>{artisticStyles}</style>
      <div
        className="artistic-page min-h-screen"
        style={{
          background: 'var(--cream)',
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(157, 67, 58, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(230, 200, 195, 0.04) 0%, transparent 50%)
          `,
        }}
      >
        <GrainOverlay />

        {/* Decorative Elements */}
        <PaintSplatter
          className="w-[300px] h-[300px] -top-16 -right-16 opacity-20"
          color="rgba(157, 67, 58, 0.12)"
          delay={200}
          scale={0.8}
        />
        <GoldRect className="top-[20%] right-[5%] opacity-20" size="sm" delay={0} />
        <GoldRect className="bottom-[60%] left-[3%] opacity-15" size="md" delay={0.5} />

        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            background: 'rgba(251, 233, 231, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(129, 53, 46, 0.08)',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            <Link
              href="/"
              className="heading-serif text-2xl font-normal"
              style={{ color: 'var(--navy)' }}
            >
              21<span className="italic">|Twenty One</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-100"
              style={{
                color: 'var(--navy)',
                opacity: 0.7,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Start Healing
            </Link>
          </div>
        </nav>

        {/* Article Header */}
        <article className="relative pt-32 pb-16 px-6 z-10">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              href="/blog"
              className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-8 transition-all duration-1000 ${
                mounted ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ color: 'var(--navy)' }}
            >
              <span>←</span>
              <span>Back to Articles</span>
            </Link>

            {/* Meta Info */}
            <div
              className={`flex flex-wrap items-center gap-4 mb-6 transition-all duration-1000 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span
                className="px-3 py-1 text-xs uppercase tracking-[0.1em]"
                style={{
                  background: 'rgba(186, 84, 72, 0.15)',
                  color: 'var(--gold)'
                }}
              >
                {post.category}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--navy)', opacity: 0.4 }}
              >
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--navy)', opacity: 0.4 }}
              >
                {post.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1
              className={`heading-serif text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight transition-all duration-1000 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ color: 'var(--navy)' }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            <p
              className={`text-xl mb-8 transition-all duration-1000 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.8 }}
            >
              {post.excerpt}
            </p>

            {/* Divider */}
            <div
              className="w-16 h-px mb-8"
              style={{ background: 'var(--gold)' }}
            />

            {/* Author */}
            <div
              className={`flex items-center gap-3 pb-8 mb-8 transition-all duration-1000 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ borderBottom: '1px solid rgba(129, 53, 46, 0.1)' }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center text-sm font-medium"
                style={{
                  background: 'rgba(186, 84, 72, 0.15)',
                  color: 'var(--gold)'
                }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p
                  className="font-medium text-sm"
                  style={{ color: 'var(--navy)' }}
                >
                  {post.author}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--navy)', opacity: 0.5 }}
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
              style={{ borderTop: '1px solid rgba(129, 53, 46, 0.1)' }}
            >
              <p
                className="text-xs uppercase tracking-[0.15em] font-medium mb-4"
                style={{ color: 'var(--navy)' }}
              >
                Topics covered:
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs"
                    style={{
                      background: 'rgba(129, 53, 46, 0.04)',
                      color: 'var(--navy)',
                      opacity: 0.7
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div
              className="mt-8 p-6"
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(129, 53, 46, 0.08)',
              }}
            >
              <p
                className="text-xs uppercase tracking-[0.15em] font-medium mb-4"
                style={{ color: 'var(--navy)' }}
              >
                Research Sources:
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.hubermanlab.com/episode/the-science-of-love-desire-and-attachment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:opacity-100"
                    style={{ color: 'var(--blue)', opacity: 0.8 }}
                  >
                    Huberman Lab: The Science of Love, Desire and Attachment
                  </a>
                </li>
                <li>
                  <a
                    href="https://hubermanlab.com/science-of-social-bonding-in-family-friendship-and-romantic-love/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:opacity-100"
                    style={{ color: 'var(--blue)', opacity: 0.8 }}
                  >
                    Huberman Lab: Science of Social Bonding
                  </a>
                </li>
                <li>
                  <a
                    href="https://ifstudies.org/blog/jordan-petersons-radical-take-on-marriage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:opacity-100"
                    style={{ color: 'var(--blue)', opacity: 0.8 }}
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
          <section className="relative py-16 px-6 z-10">
            <div className="max-w-5xl mx-auto">
              <h2
                className="heading-serif text-2xl font-light mb-8"
                style={{ color: 'var(--navy)' }}
              >
                Related <span className="italic" style={{ color: 'var(--blue)' }}>Articles</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group p-6 md:p-8 block transition-all duration-300 hover:translate-y-[-4px]"
                    style={{
                      background: 'var(--white)',
                      border: '1px solid rgba(129, 53, 46, 0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs"
                        style={{ color: 'var(--navy)', opacity: 0.4 }}
                      >
                        {relatedPost.readTime} min read
                      </span>
                    </div>
                    <h3
                      className="heading-serif text-xl font-light mb-3 group-hover:text-[var(--blue)] transition-colors"
                      style={{ color: 'var(--navy)' }}
                    >
                      {relatedPost.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-2 mb-4"
                      style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.7 }}
                    >
                      {relatedPost.excerpt}
                    </p>
                    <span
                      className="text-sm font-medium group-hover:translate-x-1 transition-transform inline-block"
                      style={{ color: 'var(--gold)' }}
                    >
                      Read more →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="relative py-20 px-6 z-10"
          style={{
            background: 'var(--navy)',
          }}
        >
          <GoldRect className="top-8 left-[8%] opacity-30" size="sm" delay={0} />
          <GoldRect className="bottom-8 right-[10%] opacity-25" size="md" delay={0.5} />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <span
              className="text-xs uppercase tracking-[0.4em] block mb-4"
              style={{ color: 'var(--gold)' }}
            >
              Transform Your Life
            </span>
            <h2
              className="heading-serif text-3xl md:text-4xl font-light mb-6"
              style={{ color: 'var(--cream)' }}
            >
              Ready to Build Better <span className="italic" style={{ color: 'var(--light-blue)' }}>Relationships?</span>
            </h2>
            <p
              className="mb-10"
              style={{ color: 'var(--cream)', opacity: 0.6, lineHeight: 1.8 }}
            >
              Apply the science of connection with our guided 21-day program.
            </p>
            <Link
              href="/app"
              className="group relative inline-block px-10 py-4 overflow-hidden transition-all duration-500"
              style={{ background: 'var(--gold)' }}
            >
              <span
                className="relative z-10 text-xs uppercase tracking-[0.15em] font-medium"
                style={{ color: 'var(--navy)' }}
              >
                Start Your Journey
              </span>
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:translate-x-0 -translate-x-full"
                style={{ background: 'var(--amber)' }}
              />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <ArtisticFooter />
      </div>
    </>
  );
}
