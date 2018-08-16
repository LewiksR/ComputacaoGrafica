float sunEarthDist = 270;
float earthMoonDist = 50;

float sunRadius = 55;
float earthRadius = 35;
float moonRadius = 15;

float earthAngle = 0;
float moonAngle = 0;

color sunColor = color(255, 245, 230);
color earthColor = color(0, 50, 255);
color moonColor = color(155, 155, 155);

PVector sunPos = new PVector(0, 0);
PVector earthPos = new PVector(0, 0);
PVector moonPos = new PVector(0, 0);

void setup()
{
  sunPos.x = width/2;
  sunPos.y = height/2;
  earthPos.x = sunPos.x + sunEarthDist;
  earthPos.y = sunPos.y;
  moonPos.x = earthPos.x + earthMoonDist;
  moonPos.y = earthPos.y;
  
  size(800, 800);
}

void draw()
{
  background(0);
  
  // Calculate angles. We will find the angle based on time, as with a clock
  earthAngle = -millis() / 120000.0 * TWO_PI;
  moonAngle = -millis() / 20000.0 * TWO_PI;
  
  earthPos.x = sunPos.x + cos(earthAngle * TWO_PI) * sunEarthDist;
  earthPos.y = sunPos.y + sin(earthAngle * TWO_PI) * sunEarthDist;
  
  moonPos.x = earthPos.x + cos(moonAngle * TWO_PI) * earthMoonDist;
  moonPos.y = earthPos.y + sin(moonAngle * TWO_PI) * earthMoonDist;
  
  stroke(0, 0, 0, 0);
  
  // Draw Sun
  fill(sunColor); 
  ellipse(sunPos.x, sunPos.y, sunRadius, sunRadius);
  
  // Draw Earth
  fill(earthColor); 
  ellipse(
    earthPos.x,
    earthPos.y,
    earthRadius,
    earthRadius);
  
  // Draw Moon
  fill(moonColor); 
  ellipse(
    moonPos.x,
    moonPos.y,
    moonRadius,
    moonRadius);
}
