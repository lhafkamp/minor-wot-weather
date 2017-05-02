(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users ul')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li class="${user.status === '1' ? 'present' : 'not-present'}">${user.name ? user.name : user.id}</li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })

  document.addEventListener('click', e => {
    if (e.target.classList.contains('present') || e.target.classList.contains('not-present')) {
      const el = e.target
      const id = e.target.innerHTML

      e.target.innerHTML = '<input type="text" placolder="naam" autofocus>'

      e.target.addEventListener('keypress', e => {
        const key = e.which || e.keyCode
        if (key === 13) { // 13 is enter
          const name = e.target.value

          socket.emit('nameChange', {
            id,
            name
          })

          name === '' ? el.innerHTML = id : el.innerHTML = `${name} (${id})`
        }
      })
    }
  })
})()
