import { useState } from 'react'
import PropTypes from 'prop-types'

const Heading = ({ text }) => <h1> {text} </h1>

const Button = ({ handleClick, text}) => {
  
  return (
    <button onClick={handleClick}>{text}</button>
  )
  
}

const StatisticLine = ({ text, value }) => {
  return(
    <div>
      <table>
        <tbody>
          <tr>
            <td> {text} </td>
            <td> {value} </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
const Statistics = ({statistics, clicks}) => {
  if (clicks === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <>
      <StatisticLine text={statistics[0].text} value={statistics[0].value} />
      <StatisticLine text={statistics[1].text} value={statistics[1].value} />
      <StatisticLine text={statistics[2].text} value={statistics[2].value} />
      <StatisticLine text={statistics[3].text} value={statistics[3].value} />
      <StatisticLine text={statistics[4].text} value={statistics[4].value} />
      <StatisticLine text={statistics[5].text} value={statistics[5].value + '%'} />
    </>
  )
}


const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neuteral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const updateGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  
    const total = updatedGood + bad + neuteral
    setAll(total)

    let mean = (updatedGood * 1) + (neuteral * 0) + (bad  * -1)
    mean /= total
    setAverage(mean)
    setPositive((updatedGood / total) * 100 )

  }
  const updateNeutral = () => {
    const updatedNeuteral = neuteral + 1
    setNeutral(updatedNeuteral)

    const total = good + bad + updatedNeuteral
    setAll(total)

    let mean = (good * 1) + (updatedNeuteral * 0) + (bad  * -1)
    mean /= total
    setAverage(mean)

    setPositive((good / total) * 100 )
  
  }
  const updateBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)

    const total = good + updatedBad + neuteral
    setAll(total)  

    let mean = (good * 1) + (neuteral * 0) + (updatedBad  * -1)
    mean /= total

    setAverage(mean)
    
    setPositive((good / total) * 100 )
  }

  return (
    <div>
      <Heading text='give feedback' />

      <Button handleClick={() => updateGood()} text='good' />
      <Button handleClick={() => updateNeutral()} text='neutral' /> 
      <Button handleClick={() => updateBad()} text='bad' />

      <Heading text='statistics' />

      <Statistics statistics={[
        {text: 'Good', value: good},
        {text:'Neuteral', value: neuteral},
        {text:'Bad', value: bad},
        {text:'All', value: all},
        {text:'Average', value: average},
        {text:'Positive', value: positive},]}  clicks={all}
      /> 
    </div>
  )
}

Heading.propTypes = {
  text: PropTypes.string.isRequired
}
Button.propTypes = {
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}
StatisticLine.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}
Statistics.propTypes = {
  statistics: PropTypes.array.isRequired,
  clicks: PropTypes.number.isRequired
}

export default App