const Notification =  ({ message }) => {
  return (
    <>
      {message.success && (
        <div className='success'>{message.success}</div>
      )}
      {message.error && (
        <div className='error'>{message.error}</div>
      )}
    </>
  )
}

export default Notification