(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li data-id="${user.id}"><a href="#" class="edit">edit</a>${user.name ? user.name : user.id} <span class="status ${user.status === '1' ? 'present' : 'not-present'}""></span></li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })

  document.addEventListener('click', e => {
    if (e.target.classList.contains('present') || e.target.classList.contains('absent')) {
      const el = e.target
      const id = e.target.getAttribute('data-id')

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
