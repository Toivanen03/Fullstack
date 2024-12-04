import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import Blog from './Blog'

describe('Blog component', () => {
    test('renders blog title', () => {
        const blog = {
            title: 'Test Blog Title'
        }
      
        render(<Blog blog={blog} onLike={() => {}} onRemove={() => {}} />)
      
        const element = screen.getByText('Test Blog Title')
        expect(element).toBeDefined()
      })

      test('displays blog details when the View button is clicked', async () => {
        const blog = {
          title: 'Test Blog',
          author: 'Test Author',
          url: 'http://testblog.com',
          likes: 42,
          user: { username: 'testuser', name: 'Test User' }
        }
      
        const mockOnLike = vi.fn()
        const mockOnRemove = vi.fn()
      
        render(
          <Blog 
            blog={blog} 
            onLike={mockOnLike} 
            onRemove={mockOnRemove} 
            currentUser={{ username: 'testuser' }} 
          />
        )

        expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
        expect(screen.queryByText(`Likes: ${blog.likes}`)).not.toBeInTheDocument()
        expect(screen.queryByText(`Added by: ${blog.user.name}`)).not.toBeInTheDocument()

        const button = screen.getByText('View')
        await userEvent.click(button)

        expect(screen.getByText((content) => content.includes(blog.url))).toBeInTheDocument()
        expect(screen.getByText((content) => content.includes(`Likes: ${blog.likes}`))).toBeInTheDocument()
        expect(screen.getByText((content) => content.includes(`Added by: ${blog.user.name}`))).toBeInTheDocument()
      })      
})