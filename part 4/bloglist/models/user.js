
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  name: String,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)