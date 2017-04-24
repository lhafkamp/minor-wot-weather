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
const connections = []

let temp
let newColor
let intermezzo = false
let now = new Date()
let intermezzoNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now
let intermezzo2PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 23, 0, 0) - now
let intermezzo4PM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0, 0) - now

if (intermezzoNoon <= 0) {
  intermezzoNoon += 86400000 // + 24 hours
}
if (intermezzo2PM <= 0) {
  intermezzo2PM += 86400000
}
if (intermezzo4PM <= 0) {
  intermezzo4PM += 86400000
}
setTimeout(() => intermezzo = true, intermezzoNoon)
setTimeout(() => intermezzo = true, intermezzo2PM)
setTimeout(() => intermezzo = true, intermezzo4PM)

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('media'))

// Request weather data from API
app.get('/', (req, res) => {
  function callback() {
    res.render('index', {
      temp,
      users
    })
  }

  fetchColor(callback)
})

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

app.get('/users', (req, res) => {
  // if (intermezzo === true) {
    const activeUsers = users.filter(user => user.status === 1)
    res.send(activeUsers.length.toString())
    intermezzo = false
  // } else {
    // The server successfully processed the request
    // and is not returning any content.
    // res.send(204)
  // }
})

app.get('*', (req, res) => {
  res.redirect('/')
})

io.on('connection', socket => {
  connections.push(socket)
  console.log('Connected: %s sockets connected', connections.length)

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', connections.length)
  })
})

server.listen(port, () => {
  console.log('App is running on http://localhost:' + port)
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
  })
}

function fetchColor(callback) {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body)
    temp = data.current_observation.temp_c

    // If the celcius is higher than 18 store orange, else store blue
    temp > 18 ? newColor = 'ffa500' : newColor = '1fe3ff'

    users.forEach(user => {
      setColor(user.id)
    })

    callback()
  })
}
