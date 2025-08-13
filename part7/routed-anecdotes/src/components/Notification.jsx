
const Notification = ({ message }) => {
  if (!message) return null
  const style = {
    border: '1px solid',
    padding: 10,
    margin: '10px 0'
  }
  return <div style={style}>{message}</div>
}

export default Notification