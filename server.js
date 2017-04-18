const path = require('path')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 2500
const APIKEY = process.env.API_KEY
// NodeMCU ID's from Luuk/Sjoerd/Merlijn
const users = ['71B6', 'E568', 'C804']

let temp
let newColor

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Function for sending data to the buttons
function sendColor(user) {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'rdc',
      t: 'sdc',
      d: 'E568',
      td: user,
      c: newColor
    }
  })
}

// Request weather data from API
app.get('/', (req, res) => {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body)
    temp = data.current_observation.temp_c

     // Render index on '/'
    res.render('index', {
      temp
    })

    // If the celcius is higher than 18 store orange, else store blue
    temp > 18 ? newColor = 'ffa500' : newColor = '1fe3ff'

    users.forEach(user => {
      sendColor(user)
    })
  })
})

app.listen(port, () => {
  console.log('App is running on http://localhost:' + port)
})
