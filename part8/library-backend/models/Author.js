import mongoose from 'mongoose'

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, unique: true },
  born: { type: Number, default: null },
})

const Author = mongoose.model('Author', authorSchema)
export default Author