import axios from "axios"

// const weatherApi = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
// const apiKey = "0872a5332ec317c9c8675f4c5b083916"
const url = "https://studies.cs.helsinki.fi/restcountries/api/all"
const getWeather = (lat, lon) => {
    console.log(`lat: ${lat}, lon: ${lon},`)
    const key = import.meta.env.VITE_SOME_KEY
    const weatherApi = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}`
    console.log('weather ', weatherApi)
    const request = axios.get(weatherApi)

    return request.then(response => {
        console.log('weather route',response.data)
        return response.data
    })
}

const getCountry = () => {
    // const url = "http://localhost:3001/country"
    const request = axios.get(url)
    return request.then(response => response.data)
}

// const getIcon = (icon) => {
//     console.log('icon ', icon)
//     const url = `https://openweathermap.org/img/wn/${icon}@2x.png`
//     const request = axios.get(url)

//     return request.then(response => {
//         console.log('icon back', response.data)
//         return response.data
//     })

// }

export default { 
    getWeather,
    getCountry,
    // getIcon
}