const path = require('path');
const express = require('express');
const request = require('request');
const app = express();

const users = ['71B6', 'E568', 'C804'];
const color = ['FFFFFF', '9600ff', '00ff2b'];
var randomValue = color[Math.floor(color.length * Math.random())];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  request({
    uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    qs: {
      t: 'sdc',
      d: '71B6',
      td: '71B6',
      c: randomValue
    }
  })
  res.render('index');
});

const port = process.env.PORT || 2500;

app.listen(port, function() {
    console.log('App is running on http://localhost:' + port);
});
