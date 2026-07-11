import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn function', () => {
  it('merges class names correctly', () => {
    const result = cn('bg-white', 'p-4', 'bg-blue-500')
    expect(result).toBe('p-4 bg-blue-500')
  })

  it('handles conditional class names', () => {
    const isTrue = true
    const result = cn('bg-white', isTrue && 'text-blue-600')
    expect(result).toBe('bg-white text-blue-600')
  })
})
