import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect } from 'vitest'
import { Select } from './_select'
import { SearchProvider } from '../context'

const SelectWithProvider = ({ children, ...props }: any) => (
  <SearchProvider>
    <Select {...props}>{children}</Select>
  </SearchProvider>
)

const SelectTriggerWithProvider = ({ children, ...props }: any) => (
  <SearchProvider>
    <Select.Trigger {...props}>{children}</Select.Trigger>
  </SearchProvider>
)

const SelectButtonWithProvider = ({ children, ...props }: any) => (
  <SearchProvider>
    <Select.Button {...props}>{children}</Select.Button>
  </SearchProvider>
)

const SelectSearchWithProvider = ({ ...props }: any) => (
  <SearchProvider>
    <Select.Search {...props} />
  </SearchProvider>
)

const SelectPanelWithProvider = ({ children, ...props }: any) => (
  <SearchProvider>
    <Select.Panel {...props}>{children}</Select.Panel>
  </SearchProvider>
)

const SelectItemWithProvider = ({ children, ...props }: any) => (
  <SearchProvider>
    <Select.Item {...props}>{children}</Select.Item>
  </SearchProvider>
)

describe('SearchSelectPrimitive', (it) => {
  it('renders select element', () => {
    render(<SelectWithProvider />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select trigger element', () => {
    render(<SelectTriggerWithProvider />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select button element', () => {
    render(<SelectButtonWithProvider />)
    expect(screen.findByRole('button')).toBeTruthy()
  })

  it('renders select search element', () => {
    render(<SelectSearchWithProvider />)
    expect(screen.findByRole('textbox')).toBeTruthy()
  })

  it('renders select panel element', () => {
    render(<SelectPanelWithProvider />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('renders select items element', () => {
    render(<SelectItemWithProvider value="" label="" />)
    expect(screen.findByRole('div')).toBeTruthy()
  })

  it('if renders item with click on trigger', async () => {
    render(
      <SearchProvider>
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
        </Select>
      </SearchProvider>,
    )
    await userEvent.click(screen.getByPlaceholderText('Procurar'))
    expect(screen.findByText('Abacaxi')).toBeTruthy()
  })
})
