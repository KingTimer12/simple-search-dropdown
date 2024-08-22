import { render, screen } from '@testing-library/react'
import { describe, expect } from 'vitest'
import { SearchSelect } from './_searchselect'

describe('SearchSelect', (it) => {
  it('renders element', () => {
    const data = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]
    render(<SearchSelect data={data} readOnly />)
    expect(screen.findByRole('p')).toBeTruthy()
  })
})
