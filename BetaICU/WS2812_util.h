#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ400);

void colorWipe(uint32_t c) 
{
  for(uint16_t i=0; i<strip.numPixels(); i++) 
  {
    strip.setPixelColor(i, c);
  }
  strip.show();
}

void hideColor() 
{
  colorWipe(strip.Color(0, 0, 0));
}

void setAllPixels(uint8_t r, uint8_t g, uint8_t b, float multiplier = 1.0) 
{
  for (int iPixel = 0; iPixel < LED_COUNT; iPixel++)
    strip.setPixelColor(iPixel,
                        (byte)((float)r * multiplier),
                        (byte)((float)g * multiplier),
                        (byte)((float)b * multiplier));
  strip.show();
}

//This method grabs the current RGB values and current brightness and fades the colors to black
void fadeBrightness(uint8_t r, uint8_t g, uint8_t b, float currentBrightness)
{
    for(float j = currentBrightness; j > 0.0; j-=0.01)
    {
          setAllPixels(r, g, b, j);
          delay(20);
    }
    hideColor();
}


