'use client';

import Link from 'next/link';
import { blogPosts, getAllCategories } from './blog-data';
import { useState, useEffect } from 'react';
import { GoldRect, GrainOverlay, artisticStyles, PaintSplatter, ArtisticFooter } from '@/components/ui/ArtisticElements';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mounted, setMounted] = useState(false);
  const categories = ['All', ...getAllCategories()];

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

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
          className="w-[350px] h-[350px] -top-16 -left-16 opacity-30"
          color="rgba(157, 67, 58, 0.12)"
          delay={200}
          scale={1}
        />
        <GoldRect className="top-[15%] right-[5%] opacity-25" size="sm" delay={0} />
        <GoldRect className="bottom-[40%] left-[3%] opacity-20" size="md" delay={0.5} />

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

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-8 transition-all duration-1000 ${
                mounted ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ color: 'var(--navy)' }}
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>

            <h1
              className={`heading-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 transition-all duration-1000 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ color: 'var(--navy)' }}
            >
              Relationship <span className="italic" style={{ color: 'var(--blue)' }}>Insights</span>
            </h1>
            <p
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.8 }}
            >
              Science-backed articles to help you understand yourself, build stronger connections, and create lasting relationships.
            </p>

            <div
              className="w-16 h-px mx-auto mb-12"
              style={{ background: 'var(--gold)' }}
            />

            {/* Category Filter */}
            <div
              className={`flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-5 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300"
                  style={{
                    background: selectedCategory === category ? 'var(--navy)' : 'transparent',
                    color: selectedCategory === category ? 'var(--cream)' : 'var(--navy)',
                    border: `1px solid ${selectedCategory === category ? 'var(--navy)' : 'rgba(129, 53, 46, 0.2)'}`,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === 'All' && (
          <section className="relative pb-16 px-6 z-10">
            <div className="max-w-5xl mx-auto">
              <h2
                className="heading-serif text-2xl font-light mb-8"
                style={{ color: 'var(--navy)' }}
              >
                Featured <span className="italic" style={{ color: 'var(--blue)' }}>Articles</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.filter(p => p.featured).slice(0, 2).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group p-6 md:p-8 block transition-all duration-300 hover:translate-y-[-4px]"
                    style={{
                      background: 'var(--white)',
                      border: '1px solid rgba(129, 53, 46, 0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="px-3 py-1 text-xs uppercase tracking-[0.1em]"
                        style={{
                          background: 'rgba(186, 84, 72, 0.15)',
                          color: 'var(--gold)'
                        }}
                      >
                        Featured
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--navy)', opacity: 0.4 }}
                      >
                        {post.readTime} min read
                      </span>
                    </div>
                    <h3
                      className="heading-serif text-xl md:text-2xl font-light mb-3 group-hover:text-[var(--blue)] transition-colors"
                      style={{ color: 'var(--navy)' }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="mb-4 line-clamp-2"
                      style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.7 }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs uppercase tracking-[0.1em]"
                        style={{ color: 'var(--navy)', opacity: 0.4 }}
                      >
                        {post.category}
                      </span>
                      <span
                        className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                        style={{ color: 'var(--gold)' }}
                      >
                        Read more →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="relative pb-24 px-6 z-10">
          <div className="max-w-5xl mx-auto">
            <h2
              className="heading-serif text-2xl font-light mb-8"
              style={{ color: 'var(--navy)' }}
            >
              {selectedCategory === 'All' ? (
                <>All <span className="italic" style={{ color: 'var(--blue)' }}>Articles</span></>
              ) : (
                <>{selectedCategory}</>
              )}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group p-6 block transition-all duration-300 hover:translate-y-[-4px]"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(129, 53, 46, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="px-2 py-1 text-xs"
                      style={{
                        background: 'rgba(129, 53, 46, 0.04)',
                        color: 'var(--navy)',
                        opacity: 0.7,
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--navy)', opacity: 0.4 }}
                    >
                      {post.readTime} min
                    </span>
                  </div>
                  <h3
                    className="heading-serif text-lg font-light mb-3 group-hover:text-[var(--blue)] transition-colors line-clamp-2"
                    style={{ color: 'var(--navy)' }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-3"
                    style={{ color: 'var(--navy)', opacity: 0.6, lineHeight: 1.7 }}
                  >
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--navy)', opacity: 0.4 }}
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span
                      className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                      style={{ color: 'var(--gold)' }}
                    >
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
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
              Start Today
            </span>
            <h2
              className="heading-serif text-3xl md:text-4xl font-light mb-6"
              style={{ color: 'var(--cream)' }}
            >
              Build Better <span className="italic" style={{ color: 'var(--light-blue)' }}>Relationships</span>
            </h2>
            <p
              className="mb-10"
              style={{ color: 'var(--cream)', opacity: 0.6, lineHeight: 1.8 }}
            >
              Start your 21-day journey to improved mental wellness and deeper connections.
            </p>
            <Link
              href="/dashboard"
              className="group relative inline-block px-10 py-4 overflow-hidden transition-all duration-500"
              style={{ background: 'var(--gold)' }}
            >
              <span
                className="relative z-10 text-xs uppercase tracking-[0.15em] font-medium"
                style={{ color: 'var(--navy)' }}
              >
                Get Started Free
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
