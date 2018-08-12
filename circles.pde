void setup()
{
  size(800, 600);
  textAlign(CENTER, CENTER);
  textSize(height/20);
}

void draw()
{
  background(255);
  renderCircle(width/2, height/2, 270, 5000);
  renderClock(width/2, height/2, 270);
}

void renderCircle(float x, float y, float radius, int resolution)
{
  renderCircle(x, y, radius, resolution, 0);
}

void renderCircle(float x, float y, float radius, int resolution, float startingAngle)
{
  beginShape();
  
  for(int i = 0; i < resolution; i++)
  {
    vertex(x + (cos((2 * PI * i / resolution) + startingAngle) * radius), y + (sin((2 * PI * i / resolution) + startingAngle) * radius));  
  }
  
  endShape(CLOSE);
}

void renderClock(float x, float y, float radius)
{
  int notches = 60;
  
  float pointerHoursLength = 0.55 * radius;
  float pointerMinutesLength = 0.75 * radius;
  float pointerSecondsLength = 0.8 * radius;
  
  float pointerHoursWidth = 0.02 * radius;
  float pointerMinutesWidth = 0.012 * radius;
  float pointerSecondsWidth = 0.007 * radius;
  
  float textOffset = 0.8;
  float notchSize;
  
  // Make notches
  for(int i = 0; i < notches; i++)
  {
    if (i % 5 == 0)
    {
      notchSize = 0.92;
      fill(0);
      text(
        Integer.toString(((i / 5) + 14) % 12 + 1),
        x + (cos(2 * PI * i / notches) * radius * textOffset),
        y + (sin(2 * PI * i / notches) * radius * textOffset));
      fill(255);
    }
    else
    {
      notchSize = 0.96;
    }
    
    line(x + (cos(2 * PI * i / notches) * radius), y + (sin(2 * PI * i / notches) * radius),
      x + (cos(2 * PI * i / notches) * radius * (notchSize)), y + (sin(2 * PI * i / notches) * radius * (notchSize)));
  }
  
  // Make pointers
  float hoursAngle = (hour() % 12) / 12.0 +
                      minute() / 12.0 / 60.0;
  float minutesAngle = minute() / 60.0 +
                      second() / 60.0 / 60.0;
  float secondsAngle = second() / 60.0;
   
  // -> Minutes
  stroke(25);
  fill(25);
  renderPointer(x, y, minutesAngle, pointerMinutesLength, pointerMinutesWidth);

  // -> Hours
  stroke(100);
  fill(100);
  renderPointer(x, y, hoursAngle, pointerHoursLength, pointerHoursWidth);
  
  // -> Seconds
  stroke(255, 0, 0);
  fill(255, 0, 0);
  renderPointer(x, y, secondsAngle, pointerSecondsLength, pointerSecondsWidth);
  stroke(0);
  fill(255);
  
  text("test", 100, 100);
}

void renderPointer(float x, float y, float angle, float pointerLenght, float pointerWidth)
{
  beginShape();
  
  vertex(
      x + (cos((angle * 2 * PI) - (PI / 2)) * pointerLenght),
      y + (sin((angle * 2 * PI) - (PI / 2)) * pointerLenght));
  
  vertex(
      x + (cos((angle * 2 * PI) + PI) * pointerWidth),
      y + (sin((angle * 2 * PI) + PI) * pointerWidth));
  
  vertex(
      x + (cos((angle * 2 * PI)) * pointerWidth),
      y + (sin((angle * 2 * PI)) * pointerWidth));
  
  endShape(CLOSE);
}
