const CountryList = ({ countries, setSearchTerm }) => (
  <ul>
    {countries.map(country => (
      <li key={country.cca3}>
        {country.name.common}{' '}
        <button onClick={() => setSearchTerm(country.name.common)}>show</button>
      </li>
    ))}
  </ul>
);

export default CountryList;
