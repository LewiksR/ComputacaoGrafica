void setup()
{
  size(800, 600);
  frameRate(30);
}

void draw()
{
  background(170);
  
  float x = width/2;
  float y = height/2;
  
  float radius = 200;
  
  int resolution = 6;
  int sides = 3;
  
  stroke(140, 200, 255, 127);
  strokeWeight(1);
  fill(210, 225, 255, 127);
  
  renderSnowfall(10, 10);
  
  stroke(140, 200, 255);
  strokeWeight(2);
  fill(210, 225, 255);
  renderSnowflake(x, y, radius, resolution, sides);
}

void renderSnowfall(float radius, float granularity)
{
  for(int y = 0; y < granularity; y++)
  {
    for(int x = 0; x < granularity; x++)
    {
      renderSnowflake(
        (x + (1.0 * (millis() % 1000) / 1000)) * width/granularity,
        (y + (1.0 * (millis() % 1000) / 1000)) * height/granularity,
        radius,
        4,
        3);
    }
  }
}

void renderSnowflake(float x, float y, float radius, int resolution, int sides)
{
  float[] a = { x, y - radius };
  float[] b = rotate(x, y, a[0], a[1], TWO_PI / sides);
  
  beginShape();
  for(int i = 0; i < sides; i++)
  {
    kochVertex(a[0], a[1], b[0], b[1], resolution);
    a = b;
    b = rotate(x, y, b[0], b[1], TWO_PI / sides);
  }
  endShape(CLOSE);
}

float[] rotate(float cx, float cy, float px, float py, float a )
{
  float _px = ((px-cx)*cos(a)-(py-cy)*sin(a))+cx;
  float _py = ((px-cx)*sin(a)+(py-cy)*cos(a))+cy;
  return new float[] { _px, _py };
}

void koch(float ax, float ay, float bx, float by, int n)
{
  if (n == 0)
  {
    line(ax, ay, bx, by);
  }
  else
  {
    float cx = ax + (1.0/3 * (bx - ax));
    float cy = ay + (1.0/3 * (by - ay));
    float dx = ax + (2.0/3 * (bx - ax));
    float dy = ay + (2.0/3 * (by - ay));
    float[] e = rotate(cx, cy, dx, dy, -PI/3);
    
    koch(ax, ay, cx, cy, n - 1);
    koch(cx, cy, e[0], e[1], n - 1);
    koch(e[0], e[1], dx, dy, n - 1);
    koch(dx, dy, bx, by, n - 1);
  }
}

void kochVertex(float ax, float ay, float bx, float by, int n)
{
  if (n == 0)
  {
    vertex(ax, ay);
    vertex(bx, by); 
  }
  else
  {
    float cx = ax + (1.0/3 * (bx - ax));
    float cy = ay + (1.0/3 * (by - ay));
    float dx = ax + (2.0/3 * (bx - ax));
    float dy = ay + (2.0/3 * (by - ay));
    float[] e = rotate(cx, cy, dx, dy, -PI/3);
    
    kochVertex(ax, ay, cx, cy, n - 1);
    kochVertex(cx, cy, e[0], e[1], n - 1);
    kochVertex(e[0], e[1], dx, dy, n - 1);
    kochVertex(dx, dy, bx, by, n - 1);
  }
}
