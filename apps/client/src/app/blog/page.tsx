'use client';

import Link from 'next/link';
import { blogPosts, getAllCategories } from './blog-data';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...getAllCategories()];

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="gradient-canvas">
        <div className="gradient-mesh"></div>
        <div className="aurora-layer aurora-1"></div>
        <div className="aurora-layer aurora-2"></div>
        <div className="aurora-layer aurora-3"></div>
        <div className="morph-blob morph-blob-1"></div>
        <div className="morph-blob morph-blob-2"></div>
        <div className="morph-blob morph-blob-3"></div>
        <div className="morph-blob morph-blob-4"></div>
        <div className="light-particle light-particle-1"></div>
        <div className="light-particle light-particle-2"></div>
        <div className="light-particle light-particle-3"></div>
        <div className="light-particle light-particle-4"></div>
        <div className="light-particle light-particle-5"></div>
        <div className="glow-spot glow-spot-1"></div>
        <div className="glow-spot glow-spot-2"></div>
        <div className="grain-overlay"></div>
      </div>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>&larr;</span>
            <span>Back to Home</span>
          </Link>

          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Relationship Insights
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--text-secondary)' }}
          >
            Science-backed articles to help you understand yourself, build stronger connections, and create lasting relationships.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: selectedCategory === category ? 'var(--brand-500)' : 'var(--bg-elevated)',
                  color: selectedCategory === category ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === category ? 'var(--brand-500)' : 'var(--border-soft)'}`,
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
        <section className="relative pb-16 px-4 z-10">
          <div className="max-w-5xl mx-auto">
            <h2
              className="font-serif text-2xl mb-8"
              style={{ color: 'var(--text-primary)' }}
            >
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.filter(p => p.featured).slice(0, 2).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="matcha-card p-6 md:p-8 block group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'var(--brand-100)',
                        color: 'var(--brand-700)'
                      }}
                    >
                      Featured
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3
                    className="font-serif text-xl md:text-2xl mb-3 group-hover:text-[var(--brand-600)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="mb-4 line-clamp-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                      style={{ color: 'var(--brand-500)' }}
                    >
                      Read more &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="relative pb-24 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-2xl mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="matcha-card p-6 block group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: 'var(--bg-muted)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {post.category}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {post.readTime} min
                  </span>
                </div>
                <h3
                  className="font-serif text-lg mb-3 group-hover:text-[var(--brand-600)] transition-colors line-clamp-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span
                    className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--brand-500)' }}
                  >
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        className="relative py-16 px-4 z-10"
        style={{ background: 'rgba(250, 245, 247, 0.9)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-serif text-2xl md:text-3xl mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Build Better Relationships
          </h2>
          <p
            className="mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Start your 21-day journey to improved mental wellness and deeper connections.
          </p>
          <Link
            href="/app"
            className="matcha-btn matcha-btn-primary inline-flex"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
