import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2 },
  published: { type: Number, required: true },
  genres: [{ type: String, required: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
})

const Book = mongoose.model('Book', bookSchema)
export default Book