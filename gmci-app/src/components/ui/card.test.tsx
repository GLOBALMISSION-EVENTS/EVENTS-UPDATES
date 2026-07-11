import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardHeader, CardTitle } from './card'

describe('Card Components', () => {
  it('renders Card with children', () => {
    render(
      <Card data-testid="card">
        <CardContent>Test Content</CardContent>
      </Card>
    )
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders CardHeader and CardTitle', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})
