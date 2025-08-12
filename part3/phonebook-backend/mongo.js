require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('connected to MongoDB');

    // Example usage to avoid unused variable warning
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    const Person = mongoose.model('Person', personSchema);

    Person.find({}).then(_result => {
      // Use _result or remove if not needed
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});