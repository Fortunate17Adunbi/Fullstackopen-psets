import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }
  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange, reset
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])


  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(latest=>(latest.concat(response.data)))
    return response.data
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const fields = [name, number]
  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.reset()
  }
 
  const handlePersonSubmit = (event) => {
    // if (!name || !number) {
    //   console.error('Fields not initialized!', { name, number })
    // return
    // }
    event.preventDefault()
    console.log('name bef',name.value)
    personService.create({ name: name.value, number: number.value})
    console.log('duo ',name, number)

    fields.forEach(a => {
      console.log('a ', a)
      a.reset()
    })
    console.log('name aft',name.value)
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input type={content.type} onChange={content.onChange} value={content.value} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input type={name.type} onChange={name.onChange} value={name.value} /> <br/>
        number <input type={number.type} onChange={number.onChange} value={number.value} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App