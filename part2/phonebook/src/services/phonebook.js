import axios from "axios"

const url = "http://localhost:3001/persons"
// const url = "/api/persons"

// Return the Phonebook object 
const getAll = ()=> {
    const request = axios.get(url)
    return request.then(response => response.data)
}   

// Create a new person and add it to the phonebook object
const create = (newPerson) => {
    const request = axios.post(url, newPerson)
    return request.then(response => response.data)
}

const remove = (id) => {
    // console.log("module remove id", id)
    console.log("url", `${url}/${id}`)
    const request = axios.delete(`${url}/${id}`)
    // console.log("request ",axios.delete(`${url}/${id}`))
    // console.log("delete ",request.then(response => response.data))
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${url}/${id}`, newObject)
    // console.log("Update request", request.then(response => response.data))
    return request.then(response => response.data)
}

export default {getAll, create, remove, update}