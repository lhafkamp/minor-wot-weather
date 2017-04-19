(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    console.log(data.users)
  })
})()
