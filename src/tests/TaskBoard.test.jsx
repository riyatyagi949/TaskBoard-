import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import TaskBoard from '../components/TaskBoard'

// Mock the useBoard hook
jest.mock('../hooks/useBoard', () => ({
  useBoard: () => ({
    tasks: [],
    columns: [],
    filteredTasks: [],
    searchTerm: '',
    setSearchTerm: jest.fn(),
    priorityFilter: 'all',
    setPriorityFilter: jest.fn(),
    sortByDueDate: false,
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    moveTask: jest.fn(),
    resetBoard: jest.fn(),
    activityLog: [],
    addActivity: jest.fn()
  })
}))

test('renders task board components', () => {
  const mockLogout = jest.fn()
  
  render(
    <AuthProvider value={{ isAuthenticated: true }}>
      <TaskBoard logout={mockLogout} />
    </AuthProvider>
  )
  
  expect(screen.getByText('Task Board')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
})
