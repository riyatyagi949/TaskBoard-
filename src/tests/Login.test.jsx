import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import Login from '../components/Login'

const renderWithAuth = (ui) => {
  return render(
    <AuthProvider>{ui}</AuthProvider>
  )
}

test('renders login form', () => {
  renderWithAuth(<Login />)
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
})

test('shows error for invalid credentials', async () => {
  renderWithAuth(<Login />)
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'wrong@example.com' }
  })
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrong' }
  })
  
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})

test('shows demo credentials hint', () => {
  renderWithAuth(<Login />)
  expect(screen.getByText('intern@demo.com')).toBeInTheDocument()
  expect(screen.getByText('intern123')).toBeInTheDocument()
})
