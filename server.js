const path = require('path');
const express = require('express');
const request = require('request');

require('dotenv').config();
const app = express();

const users = ['71B6', 'E568', 'C804'];
const randomUser = users[Math.floor(users.length * Math.random())];
const colors = ['FFFFFF', '9600ff', '00ff2b'];
const randomColor = colors[Math.floor(colors.length * Math.random())];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let temp = '';
let newColor = '';

const APIKEY = process.env.API_KEY;

app.get('/', function(req, res) {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body);
    temp = data.current_observation.temp_c;
  });
  if (temp > 10) {
    newColor = 'ffa500';
  } else {
    newColor = '1fe3ff';
  }
  res.render('index');

  sendColor();
});

function sendColor() {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'rdc',
      t: 'sdc',
      d: '71B6',
      td: '71B6',
      m: 'test',
      c: newColor
    }
  });
}

const port = process.env.PORT || 2500;

app.listen(port, function() {
    console.log('App is running on http://localhost:' + port);
});
