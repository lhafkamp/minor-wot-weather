const path = require('path');
const express = require('express');
const request = require('request');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  request(`http://api.giphy.com/v1/gifs/search?q=winner&api_key=dc6zaTOxFJmzC`, (error, response, body) => {
  const data = JSON.parse(body);
  res.render('index', {
    data,
  });
});

var port = process.env.PORT || 2500;

app.listen(port, function() {
    console.log('App is running on http://localhost:' + port);
});
