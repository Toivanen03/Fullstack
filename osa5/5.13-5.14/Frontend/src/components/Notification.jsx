const Notification = ({ message, type }) => {
    if (message === null) {
      return null
    }
  
    const notificationClass = type ? type : 'normal'

    return (
      <div className={notificationClass}>
        {message}
      </div>
    )
  }
  
  export default Notification