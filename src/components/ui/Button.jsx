import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-lift hover:bg-brand-700 focus-visible:outline-brand-600',
  accent:
    'bg-linear-to-r from-amber-glow to-amber-500 text-ink-900 shadow-[0_8px_24px_-8px_rgb(255,181,69,0.6)] hover:brightness-105 focus-visible:outline-amber-500',
  outline:
    'border border-ink-200 text-ink-800 bg-white/70 hover:bg-white hover:border-brand-300 focus-visible:outline-brand-500',
  ghost: 'text-ink-700 hover:bg-ink-100 focus-visible:outline-brand-500',
  white: 'bg-white text-brand-700 hover:bg-brand-50 shadow-soft focus-visible:outline-white',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
