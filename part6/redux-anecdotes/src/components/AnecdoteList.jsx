import { useSelector, useDispatch } from 'react-redux'
import { voteAnec } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter.trim().length === 0) {
      return anecdotes
    } else {
      return anecdotes.filter(anec => anec.content.toLowerCase().includes(filter.trim().toLowerCase()))
    }
  })
  const dispatch = useDispatch()

  const vote = (id, anecdote) => {
    console.log('vote ', id)
    dispatch(voteAnec(id, anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
  
  const sorted = [...anecdotes].sort((a, b) => b.votes - a.votes)
  return (
    <>
      {sorted.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>    
  )
}

export default AnecdoteList