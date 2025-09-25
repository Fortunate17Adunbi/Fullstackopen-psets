
import { createSlice, current } from '@reduxjs/toolkit'


const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterText(state, action) {
      console.log('filterText receives')
      console.log('filterText state', state)
      return action.payload
    }
  }
})

// export const filterText = (text) => {
//   return {
//     type: 'TEXT_FILTER',
//     payload: text
//   }
// }

// const filterReducer = (state = '', action) => {
//   switch (action.type) {
//     case 'TEXT_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

export const { filterText } = filterSlice.actions
export default filterSlice.reducer