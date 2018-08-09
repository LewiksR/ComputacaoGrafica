void setup()
{
  size(800, 600);
}

void draw()
{
  background(255);
  float ax = 10;
  float ay = 300;
  float bx = 790;
  float by = 300;
  //int n = 5;
  koch(ax, ay, bx, by, 8*mouseX/width);
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
