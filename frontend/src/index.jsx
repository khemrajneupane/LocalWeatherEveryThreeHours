import React from 'react'
import ReactDOM from 'react-dom'

const baseURL = process.env.baseURL || 'http://localhost:3003/api' //locally


// ktm :   http://localhost:3003/api/forecast?lat=27.700001&lon=85.333336&units=metric&cnt=7
// weather: http://localhost:3003/api/weather?lat=27.700001&lon=85.333336&units=metric&cnt=7
const getWeatherFromApi = async (lat, lon) => {
    try {
        const responseForecast = await fetch(`${baseURL}/forecast?lat=${lat}&lon=${lon}`)
        const responseWeather = await fetch(`${baseURL}/weather`)
        const dataForecast = await responseForecast.json()
        const dataWeather = await responseWeather.json()

        const equationRouting = lat === null && lon === null ? dataWeather : dataForecast

        return equationRouting
    } catch (error) {
        console.error(error)
    }
    return {}
}

const getPosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }))


getPosition()
    .then((position) => ({

        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }))
    .catch((err) => console.error(err.message))

const returnTime = (unixtime) => {
    const hours = new Date(unixtime * 1000).getHours()
    const minutes = new Date(unixtime * 1000).getMinutes()
    return (`${hours}:${minutes}`)
}

export default class Weather extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            icon: [],
            description: [],
            time: [],
            temperature: [],
            city: '',
            text: 'The time now: ',
        }
    }

    async UNSAFE_componentWillMount() {
        try {
            const latLan = await getPosition()
            const weather = await getWeatherFromApi(latLan.coords.latitude, latLan.coords.longitude)
            const descriptions = weather.list.map((d) => d.weather.map((w) => w.description))
            const times = weather.list.map((d) => d.dt)
            const temp = weather.list.map((t) => Math.round(t.main.temp))
            const imgs = weather.list.map((d) => d.weather.map((w) => w.icon))
            this.setState({
                description: descriptions,
                icon: imgs,
                time: times,
                temperature: temp,
                city: `Displaying the weather near ${weather.city.name}`,
            })
        } catch (error) {
            console.error(error.message)
        }
    }

    styles = {

        td: { width: '14%', backgroundColor: '#8C728A', height: '100px' },
        th: { width: '14%', backgroundColor: '#728A8C', height: '100px' },

    };

    render() {
        const today = new Date().toUTCString()
        const {
            icon, description, time, temperature,
        } = this.state
        const describe = description.map((d, index) => <td style={this.styles.td} key={index}>{d}</td>)
        const hrMn = time.map((t, index) => <th style={this.styles.th} key={index}>{returnTime(t)}</th>)
        const imageIcon = icon.map((i, index) => <th style={this.styles.th} key={index}><img src={`http://openweathermap.org/img/w/${i}.png`} alt="weatherIcon" /></th>)
        const temp = temperature.map((t, index) => <th style={this.styles.th} key={index}>{t} &deg;C</th>)
        const conditionalRender = !this.state.city ? 'Loading...' : `${this.state.text} ${today}`
        return (
            <div>

                <p> {conditionalRender}</p>
                <table>
                    <thead>
                        <tr><td colSpan="6">{this.state.city}</td></tr>
                        <tr>
                            {hrMn}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {temp}
                        </tr>
                        <tr>
                            {imageIcon}
                        </tr>
                        <tr>
                            {describe}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

ReactDOM.render(<Weather />, document.getElementById('app'))
