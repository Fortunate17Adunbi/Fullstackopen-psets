
import { createSlice } from '@reduxjs/toolkit'
// import { startListening } from './listenerMiddleware'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotis (state, action) {
      console.log('action for notis ', action)
      return action.payload
    },
    removeNotis (state) {
      return null
    },
  }
})

export const { setNotis, removeNotis } = notificationSlice.actions
export const setNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotis(message))
    setTimeout(() => {
      dispatch(removeNotis())
    }, timeout * 1000)
  }
}
export default notificationSlice.reducer

// startListening({
//   actionCreator: setNotis,
//   effect: async (action, listenerApi) => {
//     await listenerApi.delay(5000)
//     listenerApi.dispatch(removeNotis())
//   }
// })