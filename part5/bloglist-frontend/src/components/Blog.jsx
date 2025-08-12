import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onRemove, own }) => {
  const [expanded, setExpanded] = useState(false)
  const blogStyle = { paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5 }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setExpanded(e => !e)}>{expanded ? 'hide' : 'view'}</button>
      </div>

      {expanded && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => onLike(blog)} className="likeButton">like</button>
          </div>
          <div>{blog.user?.name}</div>
          {own && (
            <button onClick={() => onRemove(blog)} className="removeButton">
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  own: PropTypes.bool.isRequired,
}

export default Blog