const Blog = ({ blog }) => (
  <div>
    Title: {blog.title}<br/>
    Author: {blog.author}<br/>
    URL: {blog.url}<br/><br/>
  </div>  
)

export default Blog