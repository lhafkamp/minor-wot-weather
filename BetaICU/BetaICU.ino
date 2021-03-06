#include <OpenWiFi.h>

#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>

#include "SpringyValue.h"
#include "config.h"
#include "WS2812_util.h"

Servo myServo;

int oldTime = 0;
int oscillationTime = 500;
String chipID;
String serverURL = SERVER_URL;
String apiURL = API_URL;
OpenWiFi hotspot;

// will store last time LED was updated
unsigned long previousMillis = 0;

// constants won't change :
const long interval = 750;

void printDebugMessage(String message) {
#ifdef DEBUG_MODE
  Serial.println(String(PROJECT_SHORT_NAME) + ": " + message);
#endif
}

// variables will change:
int buttonState = 0; // variable for reading the pushbutton status

void setup()
{
  pinMode(BUTTONLOW_PIN, OUTPUT);
  pinMode(TILT_PIN, INPUT);

  digitalWrite(BUTTONLOW_PIN, LOW);

  Serial.begin(115200); Serial.println("");
  strip.begin();
  strip.setBrightness(255);
  setAllPixels(0, 255, 255, 1.0);

  userStrip.begin();
  userStrip.show(); // Initialize all pixels to 'off'
  userStrip.setBrightness(40);

  WiFiManager wifiManager;
  int counter = 0;

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  while (digitalRead(BUTTON_PIN) == LOW)
  {
    counter++;
    delay(10);

    if (counter > 500)
    {
      wifiManager.resetSettings();
      printDebugMessage("Remove all wifi settings!");
      setAllPixels(255, 0, 0, 1.0);
      fadeBrightness(255, 0, 0, 1.0);
      ESP.reset();
    }
  }
  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  chipID = generateChipID();
  printDebugMessage(String("Last 2 bytes of chip ID: ") + chipID);
  String configSSID = String(CONFIG_SSID) + "_" + chipID;

  wifiManager.autoConnect(configSSID.c_str());
  fadeBrightness(0, 255, 255, 1.0);

  setStatus(0);
}

//This method starts an oscillation movement in both the LED and servo
void oscillate(float springConstant, float dampConstant, int c)
{
  SpringyValue spring;

  byte red = (c >> 16) & 0xff;
  byte green = (c >> 8) & 0xff;
  byte blue = c & 0xff;

  spring.c = springConstant;
  spring.k = dampConstant / 100;
  spring.perturb(255);

  //Start oscillating
  for (int i = 0; i < oscillationTime; i++)
  {
    spring.update(0.01);
    setAllPixels(red, green, blue, abs(spring.x) / 255.0);
    myServo.write(90 + spring.x / 4);

    //Check for button press
    if (digitalRead(BUTTON_PIN) == LOW)
    {
      //Fade the current color out
      fadeBrightness(red, green, blue, abs(spring.x) / 255.0);
      return;
    }
    delay(10);
  }
  fadeBrightness(red, green, blue, abs(spring.x) / 255.0);
}

int oldButtonState = digitalRead(TILT_PIN);

void loop()
{
  buttonState = digitalRead(TILT_PIN);
  
  //Check for button press
  if (digitalRead(BUTTON_PIN) == LOW)
  {
    sendButtonPress();
    delay(250);
  }

  //Every requestDelay, send a request to the server
  if (millis() > oldTime + REQUEST_DELAY)
  {
    requestMessage();
    requestUsers();
    oldTime = millis();
  }

  unsigned long currentMillis = millis();

  // if the LED is off turn it on and vice-versa:
  if (oldButtonState != buttonState && buttonState == HIGH && currentMillis - previousMillis >= interval) {
    Serial.println(buttonState);
    setStatus(buttonState);

    previousMillis = currentMillis;
  } else if (oldButtonState != buttonState && currentMillis - previousMillis >= interval) {
    Serial.println(buttonState);
    setStatus(buttonState);

    previousMillis = currentMillis;
  }
    
  oldButtonState = buttonState;
}

void sendButtonPress()
{
  printDebugMessage("Sending button press to server");
  HTTPClient http;
  http.begin(serverURL + "/api.php?t=sqi&d=" + chipID);
  uint16_t httpCode = http.GET();
  http.end();
}

void requestMessage()
{
//Serial.print("requestMessageCalled");
  hideColor();

  HTTPClient http;
  String requestString = serverURL + "/api.php?t=gqi&d=" + chipID + "&v=2"; // look up api index, action is 
  http.begin(requestString);
  int httpCode = http.GET();
  
  if (httpCode == 200)
  {
    String response;
    response = http.getString();

    if (response == "-1")
    {
      printDebugMessage("There are no messages waiting in the queue");
    }
    else
    {
      //Get the indexes of some commas, will be used to split strings
      int firstComma = response.indexOf(',');
      int secondComma = response.indexOf(',', firstComma + 1);
      int thirdComma = response.indexOf(',', secondComma + 1);

      //Parse data as strings
      String hexColor = response.substring(0, 7);
      String springConstant = response.substring(firstComma + 1, secondComma);
      String dampConstant = response.substring(secondComma + 1, thirdComma);;
      String message = response.substring(thirdComma + 1, response.length());;

      printDebugMessage("Message received from server: \n");
      printDebugMessage("Hex color received: " + hexColor);
      printDebugMessage("Spring constant received: " + springConstant);
      printDebugMessage("Damp constant received: " + dampConstant);
      printDebugMessage("Message received: " + message);

      //Extract the hex color and fade the led strip
      int number = (int) strtol( &response[1], NULL, 16);
      oscillate(springConstant.toFloat(), dampConstant.toFloat(), number);
    }
  }
  else
  {
    ESP.reset();
  }

  http.end();
}

void requestUsers()
{
  HTTPClient http;
  String requestString = apiURL + "/users";
  http.begin(requestString);
  int httpCode = http.GET();

  Serial.println(apiURL + "/users");
  Serial.println(httpCode);
  
  if (httpCode == 204)
  {
    Serial.println("geen data");
    setUserLeds(255, 255, 0, -1);
  }
  else
  {
    String response;
    
    response = http.getString();
    
    setUserLeds(255, 255, 0, response.toInt());  
  }

  http.end();
}

void setStatus(int status) {
  if (status == 0) {
    setAllPixels(255, 0, 0, 1.0);
  } else {
    setAllPixels(0, 255, 0, 1.0);
  }

  // send HTTP request with status
  printDebugMessage("Sending button press to server");
  HTTPClient http;
  http.begin(apiURL + "/status?id=" + chipID + "&status=" + status);
  uint16_t httpCode = http.GET();
  http.end();
}

String generateChipID()
{
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);

  chipIDString.toUpperCase();
  while (chipIDString.length() < 4)
    chipIDString = String("0") + chipIDString;

  return chipIDString;
}

