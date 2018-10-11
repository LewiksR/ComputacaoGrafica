textureLoader.Load(['earth.jpg']);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 7.5 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var texture = new THREE.TextureLoader().load("textures/earth.jpg");

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

        let v00 = ((i * (resolution)) + j) % verticesAmount;                    // Vertex at x + 0, y + 0
        let v01 = ((i * (resolution)) + j + 1) % verticesAmount;                // Vertex at x + 0, y + 1
        let v10 = ((i * (resolution)) + j + resolution + 1) % verticesAmount;   // Vertex at x + 1, y + 0
        let v11 = ((i * (resolution)) + j + resolution + 2) % verticesAmount;   // Vertex at x + 1, y + 1

        geometry.faces.push(new THREE.Face3(
            v00,
            v01,
            v10));
        geometry.faces.push(new THREE.Face3(
            v01,
            v11,
            v10));

	// Create UVs
    }
}
geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshStandardMaterial({ map: texture });

//var material = new THREE.MeshDepthMaterial();
//var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var mesh = new THREE.Mesh(geometry, material);

// var material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );
// var mesh = new THREE.Points(geometry, material);

scene.add( mesh );

camera.position.z = 5;

mesh.rotation.z = 0.3;

var animate = function () {
    requestAnimationFrame( animate );

    mesh.rotateY(0.01);

    renderer.render( scene, camera );
};

animate();
