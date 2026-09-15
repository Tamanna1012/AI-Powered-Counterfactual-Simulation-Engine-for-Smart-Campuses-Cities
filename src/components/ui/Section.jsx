export default function Section({ id, className = '', containerClassName = '', children }) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      <div className={`mx-auto max-w-7xl px-5 sm:px-8 ${containerClassName}`}>{children}</div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className = '',
}) {
  const isDark = tone === 'dark'
  return (
    <div
      className={`mx-auto max-w-2xl ${align === 'center' ? 'text-center' : 'text-left mx-0'} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset ${
            isDark
              ? 'bg-white/10 text-white ring-white/20'
              : 'bg-brand-50 text-brand-700 ring-brand-200'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl ${isDark ? 'text-white' : 'text-ink-900'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-ink-300' : 'text-ink-500'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
