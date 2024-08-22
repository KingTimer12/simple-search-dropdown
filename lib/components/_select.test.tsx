import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect } from 'vitest'
import { Select } from './_select'

describe('SearchSelectPrimitive', (it) => {
  it('renders select element', () => {
    render(<Select />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select trigger element', () => {
    render(<Select.Trigger />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select button element', () => {
    render(<Select.Button />)
    expect(screen.findByRole('button')).toBeTruthy()
  })

  it('renders select search element', () => {
    render(<Select.Search />)
    expect(screen.findByRole('input')).toBeTruthy()
  })

  it('renders select panel element', () => {
    render(<Select.Panel />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select items element', () => {
    render(<Select.Item value="" label="" />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('if renders item with click on trigger', async () => {
    render(
      <Select>
        <Select.Trigger>
          <Select.Search placeholder="Procurar" />
        </Select.Trigger>
        <Select.Panel>
          <Select.Item value="1" label="1">
            Abacaxi
          </Select.Item>
          <Select.Item value="2" label="2">
            Limão
          </Select.Item>
        </Select.Panel>
      </Select>,
    )
    await userEvent.click(screen.getByPlaceholderText('Procurar'))
    expect(screen.findByText('Abacaxi')).toBeTruthy()
  })
})
