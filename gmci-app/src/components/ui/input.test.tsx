import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('accepts text input', () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello' } })
    expect(onChange).toHaveBeenCalled()
  })
})
