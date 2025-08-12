const Notification = ({ message, type }) => {
  if (!message) return null
  const style = {
    border: '1px solid',
    padding: 10,
    marginBottom: 10,
    color: type === 'error' ? 'crimson' : 'green',
  }
  return <div style={style} className={type}>{message}</div>
}

export default Notification