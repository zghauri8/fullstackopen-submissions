const Notification = ({ message, type }) => {
  if (!message) return null;

  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: '#ddd',
    border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
