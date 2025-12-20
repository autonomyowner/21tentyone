'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  specs: { label: string; value: string }[];
  inStock: boolean;
  badge?: string;
}

const products: Product[] = [
  {
    id: '21-day-journal',
    name: '21-Day Healing Journal',
    tagline: 'Transform your thoughts, one day at a time',
    description:
      'A beautifully crafted guided journal designed to complement your 21-day healing journey. Each page features prompts based on cognitive behavioral therapy principles, helping you identify patterns, reframe thoughts, and build healthier mental habits.',
    price: 29.99,
    originalPrice: 49.99,
    features: [
      '21 daily guided prompts',
      'Morning & evening reflection pages',
      'Cognitive bias awareness exercises',
      'Gratitude & progress tracking',
      'Premium 120gsm paper',
      'Lay-flat binding for easy writing',
    ],
    specs: [
      { label: 'Pages', value: '160 pages' },
      { label: 'Size', value: 'A5 (5.8" x 8.3")' },
      { label: 'Cover', value: 'Soft-touch matte' },
      { label: 'Binding', value: 'Lay-flat stitched' },
    ],
    inStock: true,
    badge: 'Best Seller',
  },
];

export default function ShopPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    // TODO: Integrate with payment/cart system
    alert(`Added ${quantity} x ${selectedProduct.name} to cart!`);
  };

  const discount = Math.round(
    ((selectedProduct.originalPrice - selectedProduct.price) /
      selectedProduct.originalPrice) *
      100
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav
            className={`flex items-center gap-2 text-sm mb-8 transition-all duration-500 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Link
              href="/"
              className="hover:underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              Home
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>Shop</span>
          </nav>

          {/* Page Title */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1
              className="text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              Wellness Essentials
            </h1>
            <p
              className="max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              Curated products designed to support your mental wellness journey.
              Each item is carefully selected to complement your healing path.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="relative px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid lg:grid-cols-2 gap-12 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Product Image */}
            <div className="relative">
              <div
                className="aspect-square rounded-3xl overflow-hidden relative group"
                style={{
                  background:
                    'linear-gradient(135deg, #f8f6f4 0%, #f0ebe6 100%)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                {/* Product Image */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src="/images/products/journal-hero.png"
                      alt="21-Day Healing Journal"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Badge */}
                {selectedProduct.badge && (
                  <div
                    className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium z-10"
                    style={{
                      background: 'var(--brand-500)',
                      color: '#FFFFFF',
                    }}
                  >
                    {selectedProduct.badge}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-8 mt-8">
                {[
                  { label: 'Free Shipping', sublabel: 'Orders $50+' },
                  { label: '30-Day Returns', sublabel: 'No questions' },
                  { label: 'Secure Payment', sublabel: 'SSL encrypted' },
                ].map((badge, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {badge.label}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {badge.sublabel}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              {/* Product Title */}
              <h2
                className="text-3xl md:text-4xl mb-3"
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  color: 'var(--text-primary)',
                }}
              >
                {selectedProduct.name}
              </h2>
              <p
                className="text-lg mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {selectedProduct.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ${selectedProduct.price}
                </span>
                <span
                  className="text-xl line-through"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ${selectedProduct.originalPrice}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: 'var(--matcha-100)',
                    color: 'var(--matcha-700)',
                  }}
                >
                  Save {discount}%
                </span>
              </div>

              {/* Description */}
              <p
                className="mb-8"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
              >
                {selectedProduct.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  What&apos;s Inside
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--matcha-500)' }}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.specs.map((spec, i) => (
                    <div key={i}>
                      <div
                        className="text-xs uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {spec.label}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                {/* Quantity Selector */}
                <div
                  className="flex items-center rounded-xl px-2"
                  style={{
                    border: '1px solid var(--border-soft)',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-xl hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    −
                  </button>
                  <span
                    className="w-12 text-center font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-12 flex items-center justify-center text-xl hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 matcha-btn matcha-btn-primary text-base py-4 px-8"
                  disabled={!selectedProduct.inStock}
                >
                  {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mt-4">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: selectedProduct.inStock
                      ? 'var(--matcha-500)'
                      : 'var(--terra-500)',
                  }}
                />
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {selectedProduct.inStock
                    ? 'In Stock - Ships within 2-3 business days'
                    : 'Currently out of stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Journal Section */}
      <section
        className="relative py-24 px-4"
        style={{
          background: 'linear-gradient(180deg, var(--cream-100) 0%, var(--bg-primary) 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              Why This Journal Works
            </h2>
            <p
              className="max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Designed by mental health professionals to guide your daily reflection and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Science-Backed Prompts',
                description:
                  'Each prompt is based on cognitive behavioral therapy principles proven to help reshape thought patterns.',
              },
              {
                title: 'Structured Progress',
                description:
                  '21 days of guided exercises build momentum and create lasting habits for mental wellness.',
              },
              {
                title: 'Beautiful Design',
                description:
                  'Premium materials and thoughtful layout make journaling a pleasure, not a chore.',
              },
            ].map((item, i) => (
              <div key={i} className="matcha-card p-8">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'var(--matcha-100)',
                  }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{
                      fontFamily: 'var(--font-dm-serif), Georgia, serif',
                      color: 'var(--matcha-700)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3
                  className="text-xl mb-3"
                  style={{
                    fontFamily: 'var(--font-dm-serif), Georgia, serif',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--text-primary)',
              }}
            >
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  'This journal helped me understand my thought patterns in ways therapy alone couldn\'t. The daily prompts are genuinely insightful.',
                author: 'Sarah M.',
                location: 'New York',
                rating: 5,
              },
              {
                quote:
                  'I\'ve tried dozens of journals. This is the first one that felt like it was designed by someone who truly understands anxiety.',
                author: 'James K.',
                location: 'Toronto',
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <div
                      key={j}
                      className="w-4 h-4"
                      style={{ color: 'var(--matcha-500)' }}
                    >
                      ★
                    </div>
                  ))}
                </div>
                <p
                  className="text-lg mb-6"
                  style={{
                    color: 'var(--text-primary)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <div
                    className="font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {testimonial.author}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-8 md:p-12 rounded-3xl text-center"
            style={{
              background: 'linear-gradient(135deg, #2E1020 0%, #4A2040 100%)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: '#FFFFFF',
              }}
            >
              Complete Your Healing Kit
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Pair the journal with our app&apos;s 21-day program for the ultimate healing experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAddToCart}
                className="px-8 py-4 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: '#FFFFFF',
                  color: '#2E1020',
                }}
              >
                Buy Journal - ${selectedProduct.price}
              </button>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                View App Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-12" />
    </div>
  );
}
