import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Notification = ({ success, error }) => {
  const succesStyle = {
    color: 'green',
    borderRadius: 5,
    background: 'lightgray',
    padding: 10,
    marginBottom: 10,
    borderStyle: 'solid'
  } 
  const errorStyle = {
    color: 'red',
    background: 'lightgray',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (success !== null) {
    return (
      <div style={succesStyle}> {success} </div>
    )
  }

  if (error !== null) {
    return (
      <div style={errorStyle}> {error} </div>
    )
  }

}

const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
        <div>
          name: <input value={props.name} onChange={props.nameEdit} />
        </div>
        <br />
        <div>
          number: <input value={props.number} onChange={props.numberEdit} />
        </div>
        <button type='submit'>add</button>
      </form>
    </>
  )
}

const Person = ({ name, number }) => {
  return (
    <>
      {name} {number}
    </>
  )
}

const Filter = ({ filter, parameter, text }) => {
  return (
    <>
      {text} <input value={parameter} onChange={filter} />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [inputChange, setInputChange] = useState({
    name: '',
    number: ''
  })

  const [filteredValue, setFilteredValue] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(phonebook => {
        console.log(phonebook)
        setPersons(phonebook)
      })
      .catch(() => {
        setError("Could Not Get Data From Server")
        setTimeout(() => {
          setError(null)
        }, 5000)        
      } 

      )
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: inputChange.name,
      number: inputChange.number
    }
    const nameExists = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    // The name alredy exist 
    if (nameExists !== undefined) {
      const numberExists = nameExists.number === newPerson.number ? true : false
      console.log("name exixts",nameExists)
      // The number matches with the name
      if (numberExists) {
        alert(`${newPerson.name} is alredy existing`)
        setInputChange({name: '', number: ''})
      }
      else if (window.confirm(`${nameExists.name} is alredy added to Phonebook, replace the old number with the new one`)) {
        const changedPerson = {...nameExists, number: newPerson.number}
        phonebookService
          .update(nameExists.id, changedPerson)
          .then(value => {
            setPersons(persons.map(person => person.id !== value.id ? person : value))
            setInputChange({name: '', number: ''})
            setSuccess(`Updated ${value.name}'s number`)
            setTimeout(() => {
              setSuccess(null)
            }, 3000)
          })
          .catch(error => {
            // console.log('error ', error)
            // setError(`information of ${changedPerson.name} has already been removed from server`)
            setError(error.response.data.error)
            
            setTimeout(() => {
              setError(null)
            }, 3000)
            // setPersons(persons.filter(person => person.id !== changedPerson.id))
            // setInputChange({name: '', number: ''})
          })
      }
    }
    else {
      phonebookService
        .create(newPerson)
        .then(newPersonObj => {  
          setPersons(persons.concat(newPersonObj))
          setInputChange({name: '', number: ''})
          setSuccess(`Added ${newPersonObj.name}'s number`)
          setTimeout(() => {
            setSuccess(null)
          }, 3000)
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 3000)
        })
    }
  }

  const handleEditName = (event) => {
    setInputChange({ 
      ...inputChange,
      name: event.target.value 
    })
  }

  const handleEditNumber = (event) => {
    setInputChange({
      ...inputChange,
      number: event.target.value
    })
  }

  const handleFilter = (event) => {
    const value = (event.target.value)
    if (value === '') {
      setShowAll(true)
    } else {
      console.log('sure', value) 
      setShowAll(false)    
      setFilteredValue(value)
      const newFilter = persons.filter( person =>  person.name.toLowerCase().includes(value.toLowerCase()) )
      setFilteredValue(newFilter)
    }
  }

  const removePerson = (id) => {
    const deletedPerson = persons.filter(person => person.id === id)
    console.log('deleted person', deletedPerson)
    if (window.confirm(`Delete ${deletedPerson[0].name} ?`)) {
      phonebookService
        .remove(id)
        .then(removedPerson => {
          console.log("successful")
          console.log(removedPerson)
          setPersons(persons.filter(person => person.id !== removedPerson.id))
          setShowAll(true)
          setFilteredValue('')
          setSuccess(`Deleted ${removedPerson.name}'s number`)

          setTimeout(() => {
            setSuccess(null)
          }, 3000)
        })
        .catch(error => {
          // console.error("error ", error)
          console.error("delete error ", error.response.data)
          // console.error("delete error2 ", error.response)
          setError(`Information of ${deletedPerson[0].name} has already been removed form server`)
          setTimeout(() => {
            setError(null)
          }, 3000)
          setPersons(persons.filter(person => person.id !== deletedPerson[0].id))
        })
    }
  }

  const namesToShow = showAll ? persons : filteredValue
  console.log('showall ', showAll)
  console.log("persons ", persons)
  console.log("names to show ", namesToShow)
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification success={success} error={error}/>
      <div>
        <Filter parameter={filteredValue.name} filter={handleFilter} text='filter shown with' />
      </div>

      <h1>Add a new</h1>
      <PersonForm onSubmit={handleSubmit}
        name={inputChange.name}
        nameEdit={handleEditName}
        number={inputChange.number}
        numberEdit={handleEditNumber}
      />

      <h1>Numbers</h1>

      {namesToShow.map(person => {
        return (
          <p key={person.id} >
            <Person name={person.name} number={person.number} />
            <button onClick={() => removePerson(person.id)}>delete</button>
          </p>
        )
      })}
    </div>
  )
}

export default App
