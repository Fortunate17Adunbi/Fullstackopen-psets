import { useEffect, useState } from 'react'
import countriesService from './services/countries'


const Data = ({ name, capital, area, languages, flag, weather }) => {
  // console.log('icon from weather', weather)
  const capitalToShow = capital ? capital : []
  return (
    <>
      <h2>{name}</h2>
      <p>capital {capitalToShow.join(", ")}</p>

      <p>area {area}</p>

      <h3>Languages: </h3>
      <ul>
        {
          languages.map(language => {
            return (
              <li key={language}>{language}</li>
            )
          })
        }    
      </ul>
      <img src={flag.png} alt={flag.alt} />
      <h2>Weather in {capitalToShow.join(", ")}</h2>
      <p>Temprature {weather.temp} celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather" />
      <p>Wind {weather.wind_speed} m/s</p>
    </>
  )
}

const Countries = ({ country }) => {
  return country.map(country => {
    return (
    country.weather && (
      <Data 
        key={country.name.common}
        name={country.name.common} 
        capital={country.capital} 
        area={country.area} 
        languages={Object.values(country.languages)} 
        flag={country.flags}
        latlng={country.latlng}
        weather={country.weather.current}
      />
    ))
  })  
}

const App = () => {

  const [newCountry, setNewCountry] = useState('')
  const [filter, setFilter] = useState({
    message: '',
    country: []
  })

  useEffect(() => {
    if (filter.country.length === 1) {
      const country = filter.country[0]
      if (country.weather) return
      countriesService.getWeather(country.latlng[0], country.latlng[1])
        .then(weather => {     
          console.log('country in here  ', country)
          setFilter(late => {
            const currentCountry = late.country[0]
            return {
              ...late, country: [{...currentCountry, weather}]
            }
          })
        })
    }
  }, [filter.country])

  const handleChange = (event) => {
    const value = event.target.value
    console.log('prompt ', value)
    setNewCountry(value)
    countriesService.getCountry()
      .then(response => {
        const filtered = response.filter(country => {
          return country.name.common.toLowerCase().includes(value.toLowerCase()) 
        })

        if (!value || filtered.length === 0) {
          setFilter({ 
            country: [], message: 'No country entered or not found'
          })
        } else {
          if (filtered.length > 10) {
            setFilter({ 
              country: [], message: 'Too many matches, specify another filter' 
            })
          } else {
            setFilter({ message: '', country: filtered})
          }
        }
        console.log('filtered  ', filtered)
      })
  }

  console.log("filter now ",filter)

  return (
    <>
      <form>
        find countries <input value={newCountry} onChange={handleChange}/>
      </form>
      {filter.message && (
        <p>{filter.message}</p>
      )} 
      
      {filter.country.length > 1 && (filter.country.map(country => 
        <p key={country.name.common}>
          {country.name.common} 
          <button onClick={() => setFilter({ message:'', country: [country]})}> show </button>
        </p> 
      ))}
      {filter.country.length === 1 && (<Countries country={filter.country} />)}

    </>
  )  
}

export default App
