'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';

// Product definitions
const products = {
  '21-day-protocol': {
    id: '21-day-protocol',
    name: '21-Day Protocol',
    subtitle: 'Main Healing Program',
    price: 27,
    originalPrice: 67,
    description: 'The complete 21-day healing protocol to transform your attachment patterns.',
    features: [
      'Complete 21-day healing protocol',
      'Daily exercises & reflections',
      'Audio meditations included',
      'Nervous system regulation techniques',
      'Relationship communication scripts',
      'Lifetime access to all materials',
    ],
  },
  'premium-pdf': {
    id: 'premium-pdf',
    name: 'Premium PDF Guide',
    subtitle: 'Comprehensive Guide',
    price: 9,
    originalPrice: null,
    description: 'An in-depth guide to understanding and healing anxious attachment.',
    features: [
      'Complete attachment theory overview',
      'Deep-dive into anxious patterns',
      'Detailed healing exercises',
      'Journaling prompts & worksheets',
      'Printable resources',
    ],
  },
};

type ProductKey = keyof typeof products;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = (searchParams.get('product') || '21-day-protocol') as ProductKey;
  const product = products[productId] || products['21-day-protocol'];

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'France',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, [name]: formatted.slice(0, 19) });
      return;
    }

    // Format expiry date
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        setFormData({ ...formData, [name]: `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}` });
      } else {
        setFormData({ ...formData, [name]: cleaned });
      }
      return;
    }

    // CVC max 3 digits
    if (name === 'cvc') {
      setFormData({ ...formData, [name]: value.slice(0, 3) });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create Stripe Checkout session via API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          productId: product.id,
          price: product.price,
          successUrl: `${window.location.origin}/thank-you?product=${product.id}`,
          cancelUrl: `${window.location.origin}/checkout?product=${product.id}`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Stripe not configured - show early access message
        alert('Early access! Contact us at support@thetwenyone.com to complete your purchase.');
        setIsProcessing(false);
      }
    } catch (error) {
      // Fallback for early access
      alert('Early access! Contact us at support@thetwenyone.com to complete your purchase.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          background: 'rgba(252, 250, 245, 0.9)',
          borderColor: 'rgba(129, 53, 46, 0.1)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              color: 'var(--navy)',
            }}
          >
            T21
          </Link>
          <Link
            href="/pricing"
            className="text-sm hover:underline"
            style={{ color: 'var(--navy)', opacity: 0.6 }}
          >
            Back to Products
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div
              className="p-8"
              style={{
                background: 'var(--white)',
                border: '1px solid rgba(129, 53, 46, 0.1)',
              }}
            >
              <h2
                className="text-xl mb-6"
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  color: 'var(--navy)',
                }}
              >
                Order Summary
              </h2>

              {/* Product Details */}
              <div
                className="p-4 mb-6"
                style={{ background: 'var(--cream)', border: '1px solid rgba(129, 53, 46, 0.05)' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span
                      className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-medium mb-2"
                      style={{
                        background: 'var(--gold)',
                        color: 'var(--navy)',
                      }}
                    >
                      {product.subtitle}
                    </span>
                    <h3
                      className="font-medium text-lg"
                      style={{ color: 'var(--navy)' }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                      One-time purchase
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: 'var(--navy)' }}
                    >
                      €{product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm line-through" style={{ color: 'var(--navy)', opacity: 0.4 }}>
                        €{product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features included */}
              <div className="mb-6">
                <p
                  className="text-sm font-medium mb-3 uppercase tracking-wider"
                  style={{ color: 'var(--gold)' }}
                >
                  What's Included
                </p>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-1.5 h-1.5"
                        style={{ background: 'var(--gold)' }}
                      />
                      <span style={{ color: 'var(--navy)', opacity: 0.7 }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div
                className="h-px my-6"
                style={{ background: 'rgba(129, 53, 46, 0.1)' }}
              />

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span style={{ color: 'var(--navy)', opacity: 0.6 }}>Subtotal</span>
                <span style={{ color: 'var(--navy)' }}>€{product.price}</span>
              </div>
              <div
                className="h-px my-4"
                style={{ background: 'rgba(129, 53, 46, 0.1)' }}
              />
              <div className="flex justify-between items-center">
                <span
                  className="font-semibold"
                  style={{ color: 'var(--navy)' }}
                >
                  Total
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: 'var(--navy)' }}
                >
                  €{product.price}
                </span>
              </div>

              {/* Guarantee */}
              <div
                className="mt-6 p-4 text-center"
                style={{ background: 'var(--cream)', border: '1px solid rgba(129, 53, 46, 0.05)' }}
              >
                <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                  30-day money-back guarantee. Lifetime access.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <h1
              className="text-2xl mb-2"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                color: 'var(--navy)',
              }}
            >
              Complete Your Purchase
            </h1>
            <p className="mb-8" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Secure payment powered by Stripe
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-base transition-all outline-none"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(129, 53, 46, 0.2)',
                    color: 'var(--navy)',
                  }}
                />
              </div>

              {/* Card Details */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  Card Information
                </label>
                <div
                  className="overflow-hidden"
                  style={{ border: '1px solid rgba(129, 53, 46, 0.2)' }}
                >
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="1234 1234 1234 1234"
                    className="w-full px-4 py-3 text-base outline-none"
                    style={{
                      background: 'var(--white)',
                      color: 'var(--navy)',
                      borderBottom: '1px solid rgba(129, 53, 46, 0.1)',
                    }}
                  />
                  <div className="flex">
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      placeholder="MM/YY"
                      className="w-1/2 px-4 py-3 text-base outline-none"
                      style={{
                        background: 'var(--white)',
                        color: 'var(--navy)',
                        borderRight: '1px solid rgba(129, 53, 46, 0.1)',
                      }}
                    />
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      required
                      placeholder="CVC"
                      className="w-1/2 px-4 py-3 text-base outline-none"
                      style={{
                        background: 'var(--white)',
                        color: 'var(--navy)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Full name"
                  className="w-full px-4 py-3 text-base transition-all outline-none"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(129, 53, 46, 0.2)',
                    color: 'var(--navy)',
                  }}
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base transition-all outline-none"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(129, 53, 46, 0.2)',
                    color: 'var(--navy)',
                  }}
                >
                  <option value="France">France</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 font-medium text-base transition-all disabled:opacity-70 uppercase tracking-wider"
                style={{
                  background: isProcessing ? 'var(--navy)' : 'var(--gold)',
                  color: isProcessing ? 'var(--cream)' : 'var(--navy)',
                }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay €${product.price}`
                )}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>SSL Secured Payment</span>
              </div>

              {/* Terms */}
              <p className="text-xs text-center" style={{ color: 'var(--navy)', opacity: 0.5 }}>
                By completing this purchase, you agree to our{' '}
                <Link href="/terms" className="underline hover:no-underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:no-underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Stripe Badge */}
      <div className="pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2"
          style={{ background: 'rgba(129, 53, 46, 0.05)' }}
        >
          <span className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            Powered by
          </span>
          <span
            className="font-semibold"
            style={{ color: 'var(--navy)', opacity: 0.7 }}
          >
            stripe
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
