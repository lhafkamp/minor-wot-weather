const path = require('path')
const http = require('http').Server
const express = require('express')
const socketio = require('socket.io')
const request = require('request')
require('dotenv').config()

const app = express()
const server = http(app)
const io = socketio(server)
const port = process.env.PORT || 2500
const APIKEY = process.env.API_KEY
const users = []

let temp
let weather
let newColor
let intermezzo = false
let now = new Date()

// Times on which the intermezzos are planned
// Format: hours, minutes, seconds, milliseconds
let intermezzoNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 17, 0, 0) - now
let intermezzo2PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 23, 0, 0) - now
let intermezzo4PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 52, 0, 0) - now

// After the intermezzo, set the timer for the next day
if (intermezzoNoon <= 0) {
  intermezzoNoon += 86400000 // + 24 hours
}
if (intermezzo2PM <= 0) {
  intermezzo2PM += 86400000
}
if (intermezzo4PM <= 0) {
  intermezzo4PM += 86400000
}

// Set the timers
setTimeout(() => {
  function callback() {
    console.log('KLEUR')
  }
  fetchColor(callback)
}, intermezzoNoon)

setTimeout(() => {
  function callback() {
    console.log('KLEUR')
  }
  fetchColor(callback)
}, intermezzo2PM)

setTimeout(() => {
  function callback() {
    console.log('KLEUR')
  }
  fetchColor(callback)
}, intermezzo4PM)

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('media'))

// Request weather data from API
app.get('/', (req, res) => {
  function callback() {
    users.forEach(user => {
      setColor(user.id)
    })
    res.render('index', {temp, users, weather: 'clear-day'})
  }

  fetchColor(callback)
})

// Endpoint to be triggered by a box to pass through its status
app.get('/status', (req, res, next) => {
  const position = users.map(x => {
    return x.id
  }).indexOf(req.query.id)
  const found = users[position]

  if (!found) {
    users.push(req.query)
    io.sockets.emit('users', {users})
  } else if (found) {
    users[position].status = req.query.status
    io.sockets.emit('users', {users})
  }
  next()
})

// Endpoint to be triggered by a box to get the user count
app.get('/users', (req, res) => {
  const activeUsers = users.filter(user => {
    return user.status === '1'
  })

  res.send((activeUsers.length - 1).toString())
})

app.get('*', (req, res) => {
  res.redirect('/')
})

// Socket.io stuff
io.on('connection', socket => {
  // When a user changes the name in the view, add it to the correct user in the users array
  socket.on('nameChange', data => {
    users.forEach(user => {
      if (user.id === data.id) {
        user.name = data.name
      }
    })

    socket.emit('serverNameChange', users)
  })
})

function setColor(user) {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'sdc',
      d: 'E568',
      td: user,
      c: newColor
    }
  }, () => {
    request(`https://oege.ie.hva.nl/~palr001/icu/api.php?t=sqi&d=E568`)
  })
}

function fetchColor(callback) {
  request(`https://api.darksky.net/forecast/${APIKEY}/52.370216,4.895168?units=si`, (error, response, body) => {
    const data = JSON.parse(body)
    temp = data.currently.temperature.toString().split('.')[0]
    weather = data.currently.weather
    // If the celcius is higher than 18 store orange, else store blue

    if (temp > 18 && weather !== 'rain') {
      newColor = 'ffa500'
    } else if (weather === 'rain') {
      newColor = '1fe3ff'
    } else {
      newColor = 'ffffff'
    }

    callback()
  })
}

server.listen(port, () => {
  console.log('App is running on http://localhost:' + port)
})
