const config = require('../utils/config')
const debug = require('debug')('weathermap')
const Koa = require('koa')
const router = require('koa-router')()
const fetch = require('node-fetch')
const cors = require('kcors')
const appId = config.APPID || ''
const mapURI = config.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5'
const targetCity = config.TARGET_CITY || 'Helsinki,fi'
const port = config.PORT || 9000

const app = new Koa()

app.use(cors())

//https://api.openweathermap.org/data/2.5/forecast?appid=a318e7cbd34562aff0648d5ef8c0d022&lat=35&lon=139&units=metric&cnt=7
//https://api.openweathermap.org/data/2.5/weather?q=kathmandu&appid=a318e7cbd34562aff0648d5ef8c0d022&lat=35&lon=139&units=metric&cnt=7

//http://localhost:3003/api/weather?lat=27.700001&lon=85.333336&units=metric&cnt=7
//http://localhost:3003/api/forecast?lat=27.700001&lon=85.333336&units=metric&cnt=7
const fetchWeather = async ({lat = null, lon=null,prefixWeather= 'weather',prefixForecast= 'forecast'}) => {
   
    //const endpoint=`${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
    const noCords = `${mapURI}/${prefixWeather}?q=${targetCity}&appid=${appId}`
    const endpoint = `${mapURI}/${prefixForecast}?appid=${appId}&lat=${lat}&lon=${lon}&units=metric&cnt=7`
    const routingEquasion = lat ===null && lon === null?noCords:endpoint
    const response = await fetch(routingEquasion)
    
    return response ? response.json() : {}
}


router.get('/api/weather', async ctx => {
    const weatherData = await fetchWeather({...ctx.request.query,prefixWeather:'weather'})
    console.log("from get('/api/weather'")
    console.log(weatherData)
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = weatherData.weather ? weatherData.weather[0]:{}
    return ctx.body
})
router.get('/api/forecast', async ctx => {
    const weatherData = await fetchWeather({...ctx.request.query,prefixForecast:'forecast'})
    console.log("weater data list: " , weatherData.list)
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = weatherData
    return ctx.body
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port)

console.log(`App listening on port ${port}`)
