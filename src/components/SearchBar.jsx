import { FiSearch } from 'react-icons/fi'

function SearchBar({ value, onChange, placeholder = 'Buscar productos...' }) {
  return (
    <label className="search-bar" aria-label="Buscar productos">
      <FiSearch aria-hidden="true" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export default SearchBar
