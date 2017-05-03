(function () {
  const io = require('socket.io-client')

  const socket = io.connect()

  socket.on('users', data => {
    const users = data.users
    const usersList = document.querySelector('.users')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li data-id="${user.id}"><a href="#" class="edit">edit</a><span class="username">${user.name ? `${user.name} (${user.id})` : user.id}</span><span class="status ${user.status === '1' ? 'present' : 'absent'}""></span></li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })

  socket.on('serverNameChange', users => {
    const usersList = document.querySelector('.users')

    console.log(users)

    function generateUserList() {
      return users.map(user => {
        return `<li data-id="${user.id}"><a href="#" class="edit">edit</a><span class="username">${user.name ? `${user.name} (${user.id})` : user.id}</span><span class="status ${user.status === '1' ? 'present' : 'absent'}""></span></li>`
      }).join('')
    }

    usersList.innerHTML = generateUserList()
  })

  document.addEventListener('click', e => {
    console.log(e)
    if (e.target.classList.contains('edit')) {
      e.preventDefault()

      const el = e.target
      const id = e.target.parentNode.getAttribute('data-id')

      e.target.nextElementSibling.innerHTML = '<input type="text" placolder="naam" autofocus>'

      e.target.nextElementSibling.addEventListener('keypress', e => {
        const key = e.which || e.keyCode
        if (key === 13) { // 13 is enter
          const name = e.target.value

          socket.emit('nameChange', {
            id,
            name
          })

          name === '' ? el.nextElementSibling.innerHTML = id : el.nextElementSibling.innerHTML = `${name} (${id})`
        }
      })
    }
  })
})()
