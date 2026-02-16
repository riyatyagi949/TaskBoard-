import { render, screen } from '@testing-library/react'
import App from '../App'

test('renders app with loading state initially', () => {
  render(<App />)
  expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
})
