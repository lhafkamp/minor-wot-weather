const path = require('path')
const Server = require('http').Server
const express = require('express')
const socketio = require('socket.io')
const request = require('request')
require('dotenv').config()

const app = express()
const server = Server(app)
const io = socketio(server)
const port = process.env.PORT || 2500
const APIKEY = process.env.API_KEY
const users = []
const connections = []

let temp
let newColor

app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('media'))

// Request weather data from API
app.get('/', (req, res) => {
  fetchColor()
  res.render('index', {
    temp
  })
})

app.get('/status', (req, res, next) => {
  const position = users.map(x => {
    return x.id
  }).indexOf(req.query.id)
  const found = users[position]

  if (!found) {
    users.push(req.query)
    console.log(users)
    io.sockets.emit('users', {users})
  } else if (found) {
    users[position].status = req.query.status
    console.log(users)
    io.sockets.emit('users', {users})
  }

  next()
})

app.get('*', (req, res) => {
  res.redirect('/')
})

io.on('connection', socket => {
  connections.push(socket)
  console.log('Connected: %s sockets connected', connections.length)

  socket.on('disconnect', () => {
    // users.splice(users.indexOf(socket.username), 1)

    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', connections.length)
  })
})

server.listen(port, () => {
  console.log('App is running on http://localhost:' + port)
})

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

function fetchColor() {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body)
    temp = data.current_observation.temp_c

    // If the celcius is higher than 18 store orange, else store blue
    temp > 0 ? newColor = 'ffa500' : newColor = '1fe3ff'

    users.forEach(user => {
      setColor(user.id)
    })
  })
}
