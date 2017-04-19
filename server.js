const path = require('path')
const express = require('express')
const request = require('request')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 2500
const APIKEY = process.env.API_KEY

// NodeMCU ID's from Luuk/Sjoerd/Merlijn
// const users = ['71B6', 'E568', 'C804']
let users = []

let temp
let newColor

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Function for sending data to the buttons
function setColor(user) {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'sdc',
      d: '71B6',
      td: user,
      c: newColor
    }
  })
}

function fetchColor(res) {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body)
    temp = data.current_observation.temp_c

     // Render index on '/'
    res.render('index', {
      temp
    })

    // If the celcius is higher than 18 store orange, else store blue
    temp > 0 ? newColor = 'ffa500' : newColor = '1fe3ff'

    users.forEach(user => {
      setColor(user);
    })
  })
}

// Request weather data from API
app.get('/', (req, res) => {
  fetchColor(res);
})

app.get('/status', (req, res) => {
  const position = users.map(function(x) {return x.id; }).indexOf(req.query.id)
  const found = users[position]

  if (!found) {
    users.push(req.query)
  } else {
    users[position].status = req.query.status
  }

  console.log(users);

  res.send('status')
})


app.listen(port, () => {
  console.log('App is running on http://localhost:' + port)
})
