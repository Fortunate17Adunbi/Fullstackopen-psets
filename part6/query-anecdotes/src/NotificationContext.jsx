
import { useReducer, createContext, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      console.log('action ', action)
      return action.payload
    case 'REMOVE':
      return null
    default:
      return state
  }
}



const notificationContext = createContext()
export const NotificationContextProvider = (props) => {
  const [notification, dispatchNotification] = useReducer(notificationReducer, null)
  // console.log('state ', [notification, dispatchNotification])

  return (
    <notificationContext.Provider value={[notification, dispatchNotification]}>
      {props.children}
    </notificationContext.Provider>
  )
}

export const setNotis = (value) => {
  // console.log('value,',value)
  return {
    type: 'SET',
    payload: value
  }
}
export const removeNotis = () => {
  return {
    type: 'REMOVE'
  }
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(notificationContext)
  return notificationAndDispatch[0]
}
export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(notificationContext)
  return notificationAndDispatch[1]
}

export default notificationContext