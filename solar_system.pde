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
float jupiterAlt = 280;
float jupiterRadius = 11;
color jupiterColor = color(230, 190, 140);
color jupiterRingColor = color(235, 210, 190);

// Saturn
PVector saturnPos = new PVector(0, 0);
float saturnAlt = 325;
float saturnRadius = 9;
color saturnColor = color(242, 220, 130);
color saturnRingColor = color(247, 230, 160);

// Uranus
PVector uranusPos = new PVector(0, 0);
float uranusAlt = 370;
float uranusRadius = 8;
color uranusColor = color(210, 235, 255);

// Neptune
PVector neptunePos = new PVector(0, 0);
float neptuneAlt = 430;
float neptuneRadius = 8;
color neptuneColor = color(100, 130, 255);

// Stars
float starFrequency = 0.0003; // Value between 0 (no stars) and 1 (everything is a fucking star)
float[] stars; // Star color, must be above 0 to be a star

// Asteroids
PVector[] asteroids; // Three-dimensional vector, X being the asteroid's base angle around the sun, Y its distance, and Z its radius
float asteroidsAlt = 225;
float asteroidsDistVariation = 13;
int asteroidsCount = 120;
float asteroidsRadius = 2;
color asteroidsColor = color(150, 100, 100);

void setup()
{
  size(900, 900);
  noStroke();

  stars = new float[width * height];

  sunPos.x = width/2;
  sunPos.y = height/2;

  for (int i = 0; i < width * height; i++)
  {
    if (random(1) < starFrequency)
    {
      stars[i] = random(100, 255);
    }
  }

  asteroids = generateAsteroidBelt(asteroidsAlt, asteroidsDistVariation, asteroidsCount, asteroidsRadius);
}

void draw()
{
  background(0);

  // Draw stars (not including the sun, you grammar nazi!
  loadPixels();
  for (int i = 0; i < width * height; i++)
  {
    // Sun light radius
    int x = i % width;
    int y = i / width;
    pixels[i] = color(30000 / pow(dist(x, y, sunPos.x, sunPos.y), 2));

    if (stars[i] > 0)
    {
      pixels[i] = color(stars[i]);
    }
  }
  updatePixels();

  // Draw Sun
  sunPos = makeCelestialBody(sunColor, sunRadius, sunPos, 0);

  // Mercury
  mercuryPos = makeCelestialBody(mercuryColor, mercuryRadius, sunPos, mercuryAlt);

  // Venus
  venusPos = makeCelestialBody(venusColor, venusRadius, sunPos, venusAlt);

  // Earth
  earthPos = makeCelestialBody(earthColor, earthRadius, sunPos, earthAlt);

  // -Moon
  moonPos = makeCelestialBody(moonColor, moonRadius, earthPos, moonAlt);

  // Mars
  marsPos = makeCelestialBody(marsColor, marsRadius, sunPos, marsAlt);

  // Asteroids
  makeAsteroidBelt();

  // Jupiter
  jupiterPos = makeCelestialBody(jupiterColor, jupiterRadius, sunPos, jupiterAlt);
  renderRing(jupiterPos, jupiterRadius + 3, jupiterRadius + 4, jupiterRingColor, 100);

  // Saturn
  saturnPos = makeCelestialBody(saturnColor, saturnRadius, sunPos, saturnAlt);
  renderRing(saturnPos, saturnRadius + 5, jupiterRadius + 7, saturnRingColor, 100);

  // Uranus
  uranusPos = makeCelestialBody(uranusColor, uranusRadius, sunPos, uranusAlt);

  // Neptune
  neptunePos = makeCelestialBody(neptuneColor, neptuneRadius, sunPos, neptuneAlt);
}

PVector[] generateAsteroidBelt(float midDistance, float gaussianDistanceVariation, int averageAsteroidCount, float averageAsteroidRadius)
{
  int asteroidCount = averageAsteroidCount + int(randomGaussian() * averageAsteroidCount / 20);
  PVector[] asteroids = new PVector[asteroidCount];

  for (int i = 0; i < asteroidCount; i++)
  {
    float distance = midDistance + randomGaussian() * gaussianDistanceVariation;
    float radius = averageAsteroidRadius + randomGaussian() * averageAsteroidRadius / 5;

    asteroids[i] = new PVector(
      TWO_PI * i + (randomGaussian() * (1 / asteroidCount)) / asteroidCount,
      distance > 1 ? distance : 1,
      radius > 1 ? radius : 1);
  }

  return asteroids;
}

void makeAsteroidBelt()
{
  for (int i = 0; i < asteroids.length; i++)
  {
    makeCelestialBody(asteroidsColor, asteroids[i].z, sunPos, asteroids[i].y, asteroids[i].x);
  }
}

PVector makeCelestialBody(color objectColor, float objectRadius, PVector parentPosition, float parentDist)
{
  return makeCelestialBody(objectColor, objectRadius, parentPosition, parentDist, 0);
}

PVector makeCelestialBody(color objectColor, float objectRadius, PVector parentPosition, float parentDist, float offsetAngle)
{
  float objectAngle = offsetAngle;

  if (parentDist > 0)
  {
    objectAngle += -millis() / (parentDist * 1000.0) * TWO_PI;
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

void renderRing(PVector position, float minRadius, float maxRadius, color ringColor, int resolution)
{
  fill(ringColor);
  noStroke();
  
  beginShape();
  for(int i = 0; i <= resolution; i++)
  {
    vertex(
      position.x + cos(TWO_PI * i / resolution) * maxRadius,
      position.y + sin(TWO_PI * i / resolution) * maxRadius);
  }
  
  for(int i = resolution; i >= 0; i--)
  {
    vertex(
      position.x + cos(TWO_PI * i / resolution) * minRadius,
      position.y + sin(TWO_PI * i / resolution) * minRadius);
  }
  
  endShape(CLOSE);
}
