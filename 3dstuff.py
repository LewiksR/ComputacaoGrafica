from OpenGL.GLUT import *
from OpenGL.GLU import *
from OpenGL.GL import *
from math import *

def MathFunctionXCone(x):
    return 2-x

def MathFunctionSphere(x, radius):
    return 

def DoRevolution(resolution, radius):
    glBegin(GL_QUADS)

    for y in range(0, resolution):
        for x  in range(0, resolution):
            glColor3f(cos(x),sin(x),cos(y))
            
            glVertex3fv(Revolution(
                MathFunctionXCone(x  / resolution * 2.0),
                (y  ) * 1 * pi / resolution))
            glVertex3fv(Revolution(
                MathFunctionXCone(x  / resolution * 2.0),
                (y+1) * 1 * pi / resolution))
            glVertex3fv(Revolution(
                MathFunctionXCone(x+1/ resolution * 2.0),
                (y+1) * 1 * pi / resolution))
            glVertex3fv(Revolution(
                MathFunctionXCone(x+1/ resolution * 2.0),
                (y  ) * 1 * pi / resolution))
    
    glEnd()

def Revolution(fx, angle):
    return [fx * cos(angle), fx, fx * sin(angle)]

def MathFunctionXYRandomOne(x, y):
    return x * y / (1 + pow(x, 2) + pow(y, 2))

def MathFunctionXYSaddle(x, y):
    return 0.5 * (-pow(x, 2) + pow(y, 2))

def MathFunctionXYParaboloid(x, y):
    return 0.5 * (pow(x, 2) + pow(y, 2))

def FunctionPlane(resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY):
    glBegin(GL_QUADS)
    
    for y in range(0, resolution):
        for x in range(0, resolution):
            glColor3f(cos(x),sin(x),cos(y))
            
            FunctionPlaneVertexAt(x  , y  , resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY)
            FunctionPlaneVertexAt(x+1, y  , resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY)
            FunctionPlaneVertexAt(x+1, y+1, resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY)
            FunctionPlaneVertexAt(x  , y+1, resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY)
    
    glEnd()

def FunctionPlaneVertexAt(x, y, resolution, minX, maxX, minY, maxY, minWorldX, maxWorldX, minWorldY, maxWorldY):
    glVertex3f(
        minWorldX + ((maxWorldX - minWorldX) * x / resolution),
        MathFunctionXYParaboloid(
            minX + (maxX - minX) * x / resolution,
            minY + (maxY - minY) * y / resolution),
        minWorldY + ((maxWorldY - minWorldY) * y / resolution))
 
def Render():
    glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT)
    glRotatef(2,1,3,0)
#    FunctionPlane(50, -1.0, 3.0, -4.0, 4.0, -1.0, 3.0, -4.0, 4.0)
    DoRevolution(10, 1)
    glutSwapBuffers()
  
def timer(i):
    glutPostRedisplay()
    glutTimerFunc(50,timer,1)
 
# PROGRAMA PRINCIPAL
glutInit(sys.argv)
glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA | GLUT_DEPTH | GLUT_MULTISAMPLE)
glutInitWindowSize(800,600)
glutCreateWindow("3D Render")
glutDisplayFunc(Render)
glEnable(GL_MULTISAMPLE)
glEnable(GL_DEPTH_TEST)
glClearColor(0.,0.,0.,1.)
gluPerspective(75,1000.0/700.0,0.1,50.0)
glTranslatef(0.0,0.0,-10)
glRotatef(45,1,1,1)
glutTimerFunc(50,timer,1)
glutMainLoop()
