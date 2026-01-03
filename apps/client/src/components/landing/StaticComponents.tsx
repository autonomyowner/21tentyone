// Static components that don't need client-side JavaScript

// Testimonial Card Component
export function TestimonialCard({
  quote,
  author,
  delay = 0
}: {
  quote: string;
  author: string;
  delay?: number;
}) {
  return (
    <div
      className="p-6 md:p-8 transition-all duration-500 hover:translate-y-[-4px]"
      style={{
        background: 'var(--white)',
        border: '1px solid rgba(129, 53, 46, 0.1)',
        animationDelay: `${delay}s`
      }}
    >
      <p
        className="text-lg leading-relaxed mb-6 italic"
        style={{ color: 'var(--navy)', opacity: 0.8 }}
      >
        "{quote}"
      </p>
      <div
        className="w-12 h-px mb-4"
        style={{ background: 'var(--gold)' }}
      />
      <p className="font-semibold" style={{ color: 'var(--navy)' }}>
        {author}
      </p>
    </div>
  );
}

// Bonus Item Component
export function BonusItem({
  number,
  title,
  description
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4" style={{ background: 'rgba(186, 84, 72, 0.08)' }}>
      <div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold"
        style={{ background: 'var(--gold)', color: 'var(--navy)' }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-semibold mb-1" style={{ color: 'var(--navy)' }}>{title}</h4>
        <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.7 }}>{description}</p>
      </div>
    </div>
  );
}

// Feature Card Component
export function FeatureCard({
  number,
  title,
  description,
  isLarge = false
}: {
  number: string;
  title: string;
  description: string;
  isLarge?: boolean;
}) {
  return (
    <div
      className={`group relative p-8 md:p-10 transition-all duration-500 hover:translate-y-[-4px] ${
        isLarge ? 'md:col-span-2' : ''
      }`}
      style={{
        background: 'var(--navy)',
        minHeight: isLarge ? '350px' : '280px'
      }}
    >
      <span
        className={`heading-serif font-light absolute -top-4 -left-2 opacity-10 ${
          isLarge ? 'text-[140px]' : 'text-[100px]'
        }`}
        style={{ color: 'var(--light-blue)' }}
      >
        {number}
      </span>

      <div className="relative z-10 h-full flex flex-col justify-end">
        <h3
          className={`heading-serif font-light mb-4 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}
          style={{ color: 'var(--cream)' }}
        >
          {title}
        </h3>
        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--cream)', opacity: 0.6 }}
        >
          {description}
        </p>

        <div
          className="w-12 h-px mt-6 transition-all duration-500 group-hover:w-24"
          style={{ background: 'var(--gold)' }}
        />
      </div>
    </div>
  );
}
