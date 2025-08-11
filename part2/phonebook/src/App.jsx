import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons));
  }, []);

  const handleAddPerson = e => {
    e.preventDefault();
    const existing = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());

    if (existing) {
      if (
        window.confirm(
          `${existing.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existing, number: newNumber };
        personService
          .update(existing.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => (p.id !== existing.id ? p : returnedPerson)));
            setNotification({ message: `Updated number for ${returnedPerson.name}`, type: 'success' });
            setTimeout(() => setNotification({ message: null, type: null }), 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setNotification({
              message: `Information of ${existing.name} has already been removed from server`,
              type: 'error',
            });
            setTimeout(() => setNotification({ message: null, type: null }), 5000);
            setPersons(persons.filter(p => p.id !== existing.id));
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' });
        setTimeout(() => setNotification({ message: null, type: null }), 5000);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        // handle backend errors if any
        setNotification({ message: 'Failed to add person', type: 'error' });
        setTimeout(() => setNotification({ message: null, type: null }), 5000);
      });
  };

  const handleDelete = id => {
    const person = persons.find(p => p.id === id);
    if (!window.confirm(`Delete ${person.name}?`)) return;

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id));
        setNotification({ message: `Deleted ${person.name}`, type: 'success' });
        setTimeout(() => setNotification({ message: null, type: null }), 5000);
      })
      .catch(error => {
        setNotification({
          message: `Information of ${person.name} has already been removed from server`,
          type: 'error',
        });
        setTimeout(() => setNotification({ message: null, type: null }), 5000);
        setPersons(persons.filter(p => p.id !== id));
      });
  };

  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <div>
        filter shown with:{' '}
        <input value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={handleAddPerson}>
        <div>
          name: <input value={newName} onChange={e => setNewName(e.target.value)} required />
        </div>
        <div>
          number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} required />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(p => (
          <li key={p.id}>
            {p.name} {p.number}{' '}
            <button onClick={() => handleDelete(p.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
