const path = require('path');
const express = require('express');
const request = require('request');

// nodeMCU ID's from Luuk/Sjoerd/Merlijn
const users = ['71B6', 'E568', 'C804'];

// empty variables for later use
let temp = '';
let newColor = '';

// env key
require('dotenv').config();
const APIKEY = process.env.API_KEY;

// set up express
const app = express();

// set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// function for sending data to the buttons
function sendColor(user) {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'rdc',
      t: 'sdc',
      d: '71B6',
      td: user,
      c: newColor
    }
  });
}

// request weather data from API
app.get('/', function(req, res) {
  request(`https://api.wunderground.com/api/${APIKEY}/conditions/q/autoip.json`, (error, response, body) => {
    const data = JSON.parse(body);
    temp = data.current_observation.temp_c;

     // render index on '/'
    res.render('index', {
      temp: temp
    });
  });

  // if the celcius is higher than 18 store orange, else store blue
  temp > 18 ? newColor = 'ffa500' : newColor = '1fe3ff';

  // run the sendColor function
  sendColor();

  users.forEach(user => {
    sendColor(user);
  });
});

// run on 2500
const port = process.env.PORT || 2500;

app.listen(port, function() {
    console.log('App is running on http://localhost:' + port);
});
