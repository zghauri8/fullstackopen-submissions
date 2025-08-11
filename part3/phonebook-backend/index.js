const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());

// Create custom Morgan token to log POST request bodies
morgan.token('post-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

// Use Morgan with custom format including post-body
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post-body')
);

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
];

// 3.1 - Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// 3.2 - Info page
app.get('/info', (req, res) => {
  const numPersons = persons.length;
  const now = new Date();
  res.send(`<p>Phonebook has info for ${numPersons} people</p><p>${now}</p>`);
});

// 3.3 - Get person by id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// 3.4 - Delete person by id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

// 3.5 & 3.6 - Add new person with validation
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is missing' });
  }
  if (!number) {
    return res.status(400).json({ error: 'number is missing' });
  }

  const nameExists = persons.some(p => p.name === name);
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const id = Math.floor(Math.random() * 1000000);
  const newPerson = { id, name, number };
  persons = persons.concat(newPerson);

  res.json(newPerson);
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
