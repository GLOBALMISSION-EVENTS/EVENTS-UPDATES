import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Test hook functionality  
export function getImageUrl(path: string) {
  const base = import.meta.env?.BASE_URL || '/'
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalizedPath}`
}
