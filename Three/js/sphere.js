textureLoader.Load(['earth.jpg']);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 7.5 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.Geometry();

// VARS
var resolution = 16;
var radius = 2;
// /VARS

function SphereVertex(radius, theta, phi) {
    return new THREE.Vector3(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(theta),
        radius * Math.cos(theta) * Math.sin(phi));
}

var verticesAmount = resolution * (resolution + 1);

// This code is flawed for cases where there is a vertex at the Y axis, since it will create redundant vertices.
for (let i = 0; i <= resolution; i++) {
    // In the current implementation, phi must always be 2PI, else there will be misplaced vertices and faces.
    let phi = 2 * Math.PI * i / resolution
    
    for (let j = 0; j <= resolution; j++) {
        let theta = -Math.PI / 2 + (Math.PI * j / resolution)
        
        if (i < resolution) { geometry.vertices.push(SphereVertex(radius, theta, phi)); }

        let v00 = ((i * (resolution)) + j) % verticesAmount;
        let v01 = ((i * (resolution)) + j + 1) % verticesAmount;
        let v10 = ((i * (resolution)) + j + resolution + 1) % verticesAmount;
        let v11 = ((i * (resolution)) + j + resolution + 2) % verticesAmount;

        geometry.faces.push(new THREE.Face3(
            v00,    // X+0, Y+0
            v01,    // X+0, Y+1
            v10));  // X+1, Y+0
        geometry.faces.push(new THREE.Face3(
            v01,    // X+0, Y+1
            v11,    // X+1, Y+1
            v10));  // X+1, Y+0
    }
}

var material = new THREE.MeshDepthMaterial( { color: 0xffffff } );
var mesh = new THREE.Mesh(geometry, material);

// var material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );
// var mesh = new THREE.Points(geometry, material);

scene.add( mesh );

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );
};

animate();
