var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 5.5 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.Geometry();

// VARS
var resolution = 8;
var radius = 2;
// /VARS

function SphereVertex(radius, theta, phi) {
    return new THREE.Vector3(
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(theta),
        radius * Math.cos(theta) * Math.sin(phi))
}

var resolutionSquared = Math.pow(resolution, 2);

// This code is flawed for cases where there is a vertex at the Y axis, since it will create redundant vertices.
for (let i = 0; i < resolution; i++) {
    // In the current implementation, phi must always be 2PI, else there will be misplaced vertices and faces.
    let phi = 2 * Math.PI * i / resolution
    
    // Should start with j at 1 so that the "bottom" vertex does not repeat.
    for (let j = 0; j < resolution; j++) {
        let theta = -Math.PI / 2 + (Math.PI * j / resolution)
        
        geometry.vertices.push(SphereVertex(radius, theta, phi));

        if (j < resolution - 1) {
            console.log("i: "+i);
            console.log("j: "+j);
            console.log("");
            geometry.faces.push(new THREE.Face3(
                ((i * resolution) + j) % resolutionSquared,                 // X+0, Y+0
                ((i * resolution) + j + 1) % resolutionSquared,             // X+0, Y+1
                ((i * resolution) + j + resolution) % resolutionSquared));  // X+1, Y+0
            geometry.faces.push(new THREE.Face3(
                ((i * resolution) + j + 1) % resolutionSquared,             // X+0, Y+1
                ((i * resolution) + j + resolution + 1) % resolutionSquared,// X+1, Y+1
                ((i * resolution) + j + resolution) % resolutionSquared));  // X+1, Y+0
        }
    }
    // console.log("i: "+i);
    // geometry.faces.push(new THREE.Face3(
    //     ((i * resolution) + resolution - 1) % resolutionSquared,
    //     ((i * resolution) - 1) % resolutionSquared,
    //     resolutionSquared));
}

var material = new THREE.MeshDepthMaterial( { color: 0xffffff } );
var mesh = new THREE.Mesh(geometry, material);

//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
scene.add( mesh );

camera.position.z = 5;

var animate = function () {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
