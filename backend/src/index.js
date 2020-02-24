const config = require('../utils/config')

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

<<<<<<< HEAD
const fetchWeather = async ({ lat = null, lon = null, prefixWeather = 'weather', prefixForecast = 'forecast' }) => {
=======
const fetchWeather = async ({lat = null, lon=null,prefixWeather= 'weather',prefixForecast= 'forecast'}) => {
  
>>>>>>> c7c7ebb3d601da958a0904e1ddb1bd6968762941
    const noCords = `${mapURI}/${prefixWeather}?q=${targetCity}&appid=${appId}`
    const endpoint = `${mapURI}/${prefixForecast}?appid=${appId}&lat=${lat}&lon=${lon}&units=metric&cnt=7`
    const routingEquasion = lat === null && lon === null ? noCords : endpoint
    const response = await fetch(routingEquasion)
    return response ? response.json() : {}
}

router.get('/api/weather', async ctx => {
    const weatherData = await fetchWeather({ ...ctx.request.query, prefixWeather: 'weather' })
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = weatherData.weather ? weatherData : {} 
    return ctx.body
})
router.get('/api/forecast', async ctx => {
    const weatherData = await fetchWeather({ ...ctx.request.query, prefixForecast: 'forecast' })
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = weatherData
    return ctx.body
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port)

console.log(`App listening on port ${port}`)
