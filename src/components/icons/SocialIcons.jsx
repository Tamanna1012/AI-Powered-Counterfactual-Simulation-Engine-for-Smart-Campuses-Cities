// lucide-react no longer ships brand/social icons, so these are small inline SVGs.
function base(props) {
  return { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', ...props }
}

export function FacebookIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.35c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.88 1.4-3.88 3.98v2.2H7.8v3h2.6V21h3.1Z" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TwitterIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M18.9 3H21.5L15.6 9.9L22.5 21H17.1L12.9 14.9L8.1 21H5.5L11.7 13.6L5.1 3H10.6L14.4 8.6L18.9 3ZM18 19.3H19.5L9.8 4.6H8.2L18 19.3Z" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5C4.1 3.5 3.25 4.36 3.25 5.44C3.25 6.5 4.08 7.38 5.22 7.38H5.25C6.42 7.38 7.25 6.5 7.25 5.44C7.23 4.36 6.42 3.5 5.25 3.5ZM20.5 13.6C20.5 10.36 18.78 8.85 16.48 8.85C14.63 8.85 13.8 9.87 13.34 10.58V8.5H9.96C10 9.53 9.96 20.5 9.96 20.5H13.34V13.9C13.34 13.55 13.37 13.2 13.47 12.95C13.75 12.25 14.39 11.53 15.46 11.53C16.87 11.53 17.13 12.93 17.13 14.41V20.5H20.5V13.6Z" />
    </svg>
  )
}

export function YoutubeIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M21.6 7.2c-.25-1.16-1.1-2.02-2.2-2.28C17.58 4.5 12 4.5 12 4.5s-5.58 0-7.4.42c-1.1.26-1.95 1.12-2.2 2.28C2 8.98 2 12 2 12s0 3.02.4 4.8c.25 1.16 1.1 2.02 2.2 2.28C6.42 19.5 12 19.5 12 19.5s5.58 0 7.4-.42c1.1-.26 1.95-1.12 2.2-2.28.4-1.78.4-4.8.4-4.8s0-3.02-.4-4.8ZM10 15.2V8.8L15.8 12 10 15.2Z" />
    </svg>
  )
}
