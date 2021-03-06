<h1 align="center">
  <img width="50%" src="media/demo.jpg" alt="impression of the online app working together with the NodeMCU">
  <br>
  <br>
  minor-wot-weather
</h1>

## Concept
The _cross-minor intermezzo_ brings together students outside every now and then for a much needed break. Consistantly going at it for too long without a break may lead to nearsightedness or other health concerns.
But changing wheather can leave the students in doubt whether to participate or not. Using a arduino setup in a box connected to a server, a message will be send to the boxes of the students so they no longer have to wonder if the intermezzo will commence.

## Link to the client:
<a href="http://cmi-wot.herokuapp.com/">http://cmi-wot.herokuapp.com/</a>

## How it works
**1. Express server**

The server request the current weather from [Darksky](https://darksky.net/dev/) and shows it in the view. Darksky also sends the current weather in words, something like 'rain' or 'clear-day'. Based on each response, the view will have a different animation. The current temperature will also be shown. The start of each intermezzo is fixed and automated, when it is time the server sends a message to all connected users.

**2. Arduino**

Every user will have a box containing a LED strip, a NodeMCU, and a tilt sensor. When the box recieves the intermezzo signal, the LED inside the box will give an indication of the weather and the LED tower shows the number of participants. Using the tilt sensor the user can make a choice whether to participate or not by flipping the box to one side or another.

<img width="50%" src="media/demo2.jpg" alt="tower">
<br>
<br>

**3. API**

The API picks up any button presses and will send a response to all the connected devices which will turn on the LED. The color of the LED depends on the current weather, blue means colder, red means warmer, flickering blue means rain.

## Build
To run the application:
```bash
git clone
```

In order to use the [Darksky](https://darksky.net/dev/) API you need to sign up at <a href="https://darksky.net/dev/">https://darksky.net/dev/</a>. You will receive the API key that you need for the app to run.

Fill in the following <a href="https://www.npmjs.com/package/dotenv">dotenv</a> variable: 

```bash
API_KEY={your API key here}
```

To use the app you need to run the following commands:  
```bash
npm install
```

To install the Node dependencies:  
```bash
npm start
```

## Wishlist
-  [ ] an extra LED strip tower that shows raindrops (blue lights) dropping from top to bottom
-  [ ] using a light sensor instead of a tilt sensor to confirm who's going or not (because the current tilt sensor is quite sensitive)
-  [ ] chatrooms where the intermezzo users can communicate with eachother

## Team

![Luuk Hafkamp](https://avatars0.githubusercontent.com/u/14187210?v=3&s=150) | ![Sjoerd Beentjes](https://avatars3.githubusercontent.com/u/11621275?v=3&s=150) | ![Merlijn Vos](https://avatars1.githubusercontent.com/u/9060226?v=3&s=150) |
---|---|---
[Luuk Hafkamp](https://github.com/lhafkamp) | [Sjoerd Beentjes](https://github.com/Sjoerdbeentjes) | [Merlijn Vos](https://github.com/Murderlon) |
