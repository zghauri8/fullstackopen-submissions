import { useState, useEffect } from 'react';
import axios from 'axios';
import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Country Search</h1>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Find countries"
      />
      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}
      {filtered.length > 1 && filtered.length <= 10 && (
        <CountryList countries={filtered} setSearchTerm={setSearchTerm} />
      )}
      {filtered.length === 1 && (
        <CountryDetails country={filtered[0]} />
      )}
    </div>
  );
};

export default App;
