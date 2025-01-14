import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const style = {
    border: notification ? 'solid 1px' : 'none',
    padding: 10,
    marginBottom: 15
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification