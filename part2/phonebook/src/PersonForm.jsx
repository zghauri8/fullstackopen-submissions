const PersonForm = ({
  onSubmit,
  nameValue,
  numberValue,
  handleNameChange,
  handleNumberChange,
  setErrorMessage // New prop to set error state
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name: nameValue, number: numberValue })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={nameValue} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={numberValue} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      {/* Error message will be rendered by parent if setErrorMessage is called */}
    </div>
  )
}

export default PersonForm