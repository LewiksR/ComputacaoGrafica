// Sun
PVector sunPos = new PVector(0, 0);
float sunRadius = 13;
color sunColor = color(255, 250, 235);

// Mercury
PVector mercuryPos = new PVector(0, 0);
float mercuryAlt = 30;
float mercuryRadius = 3;
color mercuryColor = color(120, 120, 200);

// Venus
PVector venusPos = new PVector(0, 0);
float venusAlt = 70;
float venusRadius = 5;
color venusColor = color(200, 190, 55);

// Earth
PVector earthPos = new PVector(0, 0);
float earthAlt = 120;
float earthRadius = 6;
color earthColor = color(0, 50, 255);

// -Moon
PVector moonPos = new PVector(0, 0);
float moonAlt = 15;
float moonRadius = 2;
color moonColor = color(175, 175, 175);

// Mars
PVector marsPos = new PVector(0, 0);
float marsAlt = 170;
float marsRadius = 7;
color marsColor = color(255, 110, 70);

// Jupiter
PVector jupiterPos = new PVector(0, 0);
float jupiterAlt = 260;
float jupiterRadius = 11;
color jupiterColor = color(230, 190, 140);

// Saturn
PVector saturnPos = new PVector(0, 0);
float saturnAlt = 305;
float saturnRadius = 9;
color saturnColor = color(242, 220, 130);

// Uranus
PVector uranusPos = new PVector(0, 0);
float uranusAlt = 340;
float uranusRadius = 8;
color uranusColor = color(210, 235, 255);

// Neptune
PVector neptunePos = new PVector(0, 0);
float neptuneAlt = 400;
float neptuneRadius = 8;
color neptuneColor = color(100, 130, 255);

// Stars
float starFrequency = 0.0003; // Value between 0 (no stars) and 1 (everything is a fucking star)
boolean[] stars; 

void setup()
{
  size(900, 900);
  stroke(0, 0, 0, 0);
  
  stars = new boolean[width * height];
  
  sunPos.x = width/2;
  sunPos.y = height/2;
  
  for(int i = 0; i < width * height; i++)
  {
    if(random(1) < starFrequency)
    {
      stars[i] = true;
    }
  }
}

void draw()
{
  background(0);
  
  // Draw stars (not including the sun, you grammar nazi!
  loadPixels();
  for(int i = 0; i < width * height; i++)
  {
    // Sun light radius
    int x = i % width;
    int y = i / width;
    pixels[i] = color(30000 / pow(dist(x, y, sunPos.x, sunPos.y), 2));
    
    if(stars[i] == true)
    {
      pixels[i] = color(255);
    }
  }
  updatePixels();
  
  // Draw Sun
  fill(sunColor); 
  ellipse(sunPos.x, sunPos.y, sunRadius * 2, sunRadius * 2);
  
  // Mercury
  mercuryPos = makePlanet(mercuryColor, mercuryRadius, sunPos, mercuryAlt);
  
  // Venus
  venusPos = makePlanet(venusColor, venusRadius, sunPos, venusAlt);
  
  // Earth
  earthPos = makePlanet(earthColor, earthRadius, sunPos, earthAlt);
  
  // -Moon
  moonPos = makePlanet(moonColor, moonRadius, earthPos, moonAlt);
  
  // Mars
  marsPos = makePlanet(marsColor, marsRadius, sunPos, marsAlt);
  
  // Jupiter
  jupiterPos = makePlanet(jupiterColor, jupiterRadius, sunPos, jupiterAlt);
  
  // Saturn
  saturnPos = makePlanet(saturnColor, saturnRadius, sunPos, saturnAlt);
  
  // Uranus
  uranusPos = makePlanet(uranusColor, uranusRadius, sunPos, uranusAlt);
  
  // Neptune
  neptunePos = makePlanet(neptuneColor, neptuneRadius, sunPos, neptuneAlt);
}

PVector makePlanet(color objectColor, float objectRadius, PVector parentPosition, float parentDist)
{
  float objectAngle = 0;
  
  if (parentDist > 0)
  {
    objectAngle = -millis() / (parentDist * 1000.0) * TWO_PI;
  }
  
  PVector objectPosition = new PVector(
    parentPosition.x + cos(objectAngle * TWO_PI) * parentDist,
    parentPosition.y + sin(objectAngle * TWO_PI) * parentDist);
  
  fill(objectColor); 
  ellipse(
    objectPosition.x,
    objectPosition.y,
    objectRadius * 2,
    objectRadius * 2);
  
  return objectPosition;
}
