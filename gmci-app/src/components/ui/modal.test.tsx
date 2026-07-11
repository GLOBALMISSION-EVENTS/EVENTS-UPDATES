import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './modal'

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test">Content</Modal>)
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test">Modal Content</Modal>)
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn()
    render(<Modal isOpen={true} onClose={onClose} title="Test">Content</Modal>)
    const closeButtons = screen.getAllByRole('button')
    // The second button is the close icon button!
    fireEvent.click(closeButtons[1])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
