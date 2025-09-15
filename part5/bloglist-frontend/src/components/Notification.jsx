const Notification =  ({ message }) => {
  return (
    <>
      {message.success && (
        <div className='success' data-testid='notification'>{message.success}</div>
      )}
      {message.error && (
        <div className='error' data-testid='notification'>{message.error}</div>
      )}
    </>
  )
}

export default Notification