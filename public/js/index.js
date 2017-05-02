(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li><a href="#" class="edit">edit</a>${user.id} <span class="status ${user.status === '1' ? 'present' : 'not-present'}""></span></li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })
})()
