const path = require('path')
const express = require('express')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('index', {
    scores
  })
})

app.get('/', function(req, res) {
  const name = req.query.name
  const seconds = req.query.time / 1000
  buttonPresses++
  res.render('index', {
    scores
  });

  console.log(name, seconds);

  scores.push({
    name,
    seconds
  });

  console.log(scores);
})

var port = process.env.PORT || 2300

app.listen(port, function() {
    console.log('App is running on http://localhost:' + port)
})
