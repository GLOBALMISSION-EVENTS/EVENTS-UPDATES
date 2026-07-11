import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter description" />)
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
  })

  it('accepts text input', () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Long description' } })
    expect(onChange).toHaveBeenCalled()
  })
})
