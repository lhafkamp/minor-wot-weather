(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users ul')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li class="${user.status === '1' ? 'present' : 'not-present'}">${user.id}</li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })
})()
