void setup()
{
  size(800, 800);
}

void draw()
{
  background(170);
  
  float x = width/2;
  float y = height/2;
  
  float ax = 0;
  float ay = 0;
  float bx = 0;
  float by = 0;
  
  float radius = 200;
  
  int resolution = 6;
  int sides = 3;
  
  stroke(140, 200, 255);
  strokeWeight(2);
  
  fill(210, 225, 255);
  
  beginShape();
  for(int i = 0; i < sides + 1; i++)
  {
    bx = x + (cos(TWO_PI * i / sides) * radius);
    by = y + (sin(TWO_PI * i / sides) * radius);
    
    if(i != 0)
    {
      kochVertex(ax, ay, bx, by, resolution);
      println("a: (" + ax + ", " + bx + ") // b: (" + bx + ", " + by + ")");
    }
    
    ax = x + (cos(TWO_PI * i / sides) * radius);
    ay = y + (sin(TWO_PI * i / sides) * radius);
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
