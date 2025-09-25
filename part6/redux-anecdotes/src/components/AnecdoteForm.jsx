
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const createAnec = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`you added '${content}' `, 5))
  }
  
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createAnec}>
        <div><input name='anecdote' /></div>
        <button>create</button>
      </form>    
    </>
  )
}

export default AnecdoteForm