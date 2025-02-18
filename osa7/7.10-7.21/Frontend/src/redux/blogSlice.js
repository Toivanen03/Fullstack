import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions

export const fetchBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = (blogObject) => async (dispatch) => {
  const newBlog = await blogService.create(blogObject)
  dispatch(addBlog(newBlog))
}

export const likeBlog = (blog) => async (dispatch) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1 }
  try {
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    dispatch(updateBlog(returnedBlog))
  } catch (error) {
    console.error("Error liking the blog:", error)
  }
}

export const deleteBlog = (id) => async (dispatch) => {
  try {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  } catch (error) {
    console.error("Error deleting the blog:", error)
  }
}

export default blogSlice.reducer
