import React from 'react'
import ReactDOM from 'react-dom'

const baseURL = process.env.baseURL || 'http://localhost:3003/api'
console.log(process.env.KEY)
const getWeatherFromApi = async (lat, lan) => {
    try {
        const response = await fetch(`${baseURL}/forecast?lat=${lat}&lon=${lan}`)
        const data = await response.json()
        return data
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
        }
    }

    async UNSAFE_componentWillMount() {
        try {
            const latLan = await getPosition()
            const weather = await getWeatherFromApi(latLan.coords.latitude, latLan.coords.longitude)
            const descriptions = weather.list.map((d) => d.weather.map((w) => w.description))
            const times = weather.list.map((d) => d.dt)
            const imgs = weather.list.map((d) => d.weather.map((w) => w.icon))
            this.setState({
                description: descriptions,
                icon: imgs,
                time: times,
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
        const { icon, description, time } = this.state
        const describe = description.map((d, index) => <td style={this.styles.td} key={index}>{d}</td>)
        const hrMn = time.map((t, index) => <th style={this.styles.th} key={index}>{returnTime(t)}</th>)
        const imageIcon = icon.map((i, index) => <th style={this.styles.th} key={index}><img src={`http://openweathermap.org/img/w/${i}.png`} alt="weatherIcon"/></th>)

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {hrMn}
                        </tr>
                    </thead>
                    <tbody>
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
