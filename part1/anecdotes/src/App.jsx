import { useState } from "react"
import PropTypes from 'prop-types'

const Result = ({ vote }) => {
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{vote.anecdotes}</p>
      <p>has {vote.vote} vote</p>

    </div>
  )
}

const Poll = ({ value, vote }) => {
  return (
    <div>
      <h1>Anecdote of the day</h1>

      <p> {value} </p>
      <p> has {vote} vote </p>
    </div>
  )
}
 
const Button = ({ handleClick, text }) => {
  return (
    <button onClick={() => handleClick()}> {text} </button>
  )
}

const App = () => {
  const anecdotes = [ 
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  // const [highestVote, setHighestVote] = useState(0)
  const [highestVote, setHighestVote] = useState({
    vote: 0,
    anecdotes: anecdotes[0]
  })

  const handleAnecdotes = () => {
    const copy = [...vote]
    const random = Math.floor(Math.random() * anecdotes.length)
    // console.log(copy[random])
    setSelected(random)
    setVote(copy)
    if (copy[random] > highestVote.vote) {
      const proto = {...highestVote}
      proto.vote = copy[random]
      proto.anecdotes = anecdotes[random]
      setHighestVote(proto)
    }
    // console.log(copy)
  }
  
  const handleVote = () => {
    // console.log (selected)
    const copy = [...vote]
    copy[selected] += 1 
    // console.log (copy[selected])
    setVote(copy)

    if (copy[selected] > highestVote.vote) {
      const proto = {...highestVote}
      // console.log(proto)
      // console.log(copy[selected])
      // console.log(anecdotes[selected])
      proto.vote = copy[selected]
      proto.anecdotes = anecdotes[selected]

      // console.log(proto)
      setHighestVote(proto)
    }
  }

  return (
    <div>
      <Poll value={anecdotes[selected]} vote={vote[selected]} />

      <Button handleClick={() => handleVote()} text='Vote'/>
      <Button handleClick={() => handleAnecdotes()} text='next anecdote'/>

      <Result vote={highestVote}/>

    </div>
  )
}

Result.propTypes = {
  vote: PropTypes.object.isRequired
}
Poll.propTypes = {
  value: PropTypes.string.isRequired,
  vote: PropTypes.number.isRequired
}
Button.propTypes = {
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}
export default App