const dummy = (blogs) => 1

const totalLikes = (blogs) =>
blogs.reduce((sum, b) => sum + (b.likes || 0), 0)

const favoriteBlog = (blogs) => {
if (!blogs || blogs.length === 0) return null
const fav = blogs.reduce((max, b) => (b.likes > max.likes ? b : max), blogs[0])
return { title: fav.title, author: fav.author, likes: fav.likes || 0 }
}

const mostBlogs = (blogs) => {
if (!blogs || blogs.length === 0) return null
const counts = blogs.reduce((acc, b) => {
acc[b.author] = (acc[b.author] || 0) + 1
return acc
}, {})
let topAuthor = null
let top = 0
for (const [author, n] of Object.entries(counts)) {
if (n > top) {
topAuthor = author
top = n
}
}
return { author: topAuthor, blogs: top }
}

const mostLikes = (blogs) => {
if (!blogs || blogs.length === 0) return null
const likeSums = blogs.reduce((acc, b) => {
acc[b.author] = (acc[b.author] || 0) + (b.likes || 0)
return acc
}, {})
let topAuthor = null
let topLikes = 0
for (const [author, likes] of Object.entries(likeSums)) {
if (likes > topLikes) {
topAuthor = author
topLikes = likes
}
}
return { author: topAuthor, likes: topLikes }
}

module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes,
}