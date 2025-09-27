
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch ,setNotis, removeNotis } from './NotificationContext'


const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote))
      dispatch(setNotis(`anecdote '${updatedAnecdote.content}' voted`))
      setTimeout(() => {
        dispatch(removeNotis())
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })
  if (result.isPending) {
    return <span>Loading...</span>
  } else if (result.isError) {
    return <div>anecdote service not available due to problems in the server</div>
  }
  console.log('result ', result)

  const anecdotes = result.data
  return (
    <div>
      <h3>Anecdote app</h3>     
      <Notification />
      <AnecdoteForm />
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
