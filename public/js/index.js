(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users ul')

    function generateUserList() {
      return users.map(user => {
        return `<li>${user.id}</li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })
})()
