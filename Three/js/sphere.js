var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 7.5 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BufferGeometry();

// VARS
var verticalSegments = 16;
var horizontalSegments = 16;
var radius = 2;

var texture = new THREE.TextureLoader().load("textures/earth.jpg");
// /VARS

function SphereVertexAsVector3(radius, theta, phi) {
    
    let array = SphereVertexAsArray(radius, theta, phi);

    return new THREE.Vector3(
        array[0],
        array[1],
        array[2]);
    
}

function SphereVertexAsObject(radius, theta, phi) {
    
    let array = SphereVertexAsArray(radius, theta, phi);

    return {
        x: array[0],
        y: array[1],
        z: array[2]};
    
}

function SphereVertexAsArray(radius, theta, phi) {

    return [
        radius * Math.cos(theta) * Math.cos(phi),
        radius * Math.sin(theta),
        radius * Math.cos(theta) * Math.sin(phi)];
    
}

function MakeTriangle(vertex00, vertex01, vertex10) {

    return {
        normal: LKUtils.math.UnitVector( LKUtils.math.VectorProduct(
            [ vertex01[0] - vertex00[0], vertex01[1] - vertex00[1], vertex01[2] - vertex00[2] ],
            [ vertex10[0] - vertex00[0], vertex10[1] - vertex00[1], vertex10[2] - vertex00[2] ]
        )).concat(LKUtils.math.UnitVector( LKUtils.math.VectorProduct(
            [ vertex10[0] - vertex01[0], vertex10[1] - vertex01[1], vertex10[2] - vertex01[2] ],
            [ vertex00[0] - vertex01[0], vertex00[1] - vertex01[1], vertex00[2] - vertex01[2] ]
        ))).concat(LKUtils.math.UnitVector( LKUtils.math.VectorProduct(
            [ vertex00[0] - vertex10[0], vertex00[1] - vertex10[1], vertex00[2] - vertex10[2] ],
            [ vertex01[0] - vertex10[0], vertex01[1] - vertex10[1], vertex01[2] - vertex10[2] ]
        ))),
        position: [
            vertex00[0], vertex00[1], vertex00[2],
            vertex10[0], vertex10[1], vertex10[2],
            vertex01[0], vertex01[1], vertex01[2]
        ],
        uv: [
            vertex00[3], vertex00[4],
            vertex01[3], vertex01[4],
            vertex10[3], vertex10[4],
        ]
    };

}

function MakeQuad(vertex00, vertex01, vertex10, vertex11) {

    let triangleA = MakeTriangle(
        vertex00,
        vertex01,
        vertex10,
    );
    let triangleB = MakeTriangle(
        vertex11,
        vertex10,
        vertex01,
    );

    return {
        normal: triangleA.normal.concat(triangleB.normal),
        position: triangleA.position.concat(triangleB.position),
        uv: triangleA.uv.concat(triangleB.uv)
    };

}

let geometryData = {
    normal: [],
    position: [],
    uv: []
};

// Calculating only one value to reduce overhead when generating geometry
let phi1 = 0;

for (let i = 0; i < verticalSegments; i++) {

    let phi0 = phi1;
    phi1 = 2 * Math.PI * (i + 1) / verticalSegments;
    let theta1 = -Math.PI / 2;
    
    for (let j = 0; j < horizontalSegments; j++) {

        let theta0 = theta1;
        theta1 = -Math.PI / 2 + (Math.PI * (j + 1) / horizontalSegments);
        
        quad = MakeQuad(
            SphereVertexAsArray( radius, theta0, phi0 ).concat([1-((i    )/verticalSegments), (j    )/horizontalSegments]),
            SphereVertexAsArray( radius, theta0, phi1 ).concat([1-((i    )/verticalSegments), (j + 1)/horizontalSegments]),
            SphereVertexAsArray( radius, theta1, phi0 ).concat([1-((i + 1)/verticalSegments), (j    )/horizontalSegments]),
            SphereVertexAsArray( radius, theta1, phi1 ).concat([1-((i + 1)/verticalSegments), (j + 1)/horizontalSegments]));

        if (i == 0 && j == 0) { console.log(quad); }

        geometryData.normal = geometryData.normal.concat(quad.normal);
        geometryData.position = geometryData.position.concat(quad.position);
        geometryData.uv = geometryData.uv.concat(quad.uv);
        
    }
}

geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(geometryData.normal), 3 ) );
geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(geometryData.position), 3 ) );
geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(geometryData.uv), 2 ) );



//geometry = new THREE.SphereBufferGeometry(radius, verticalSegments, horizontalSegments);

//var material = new THREE.MeshDepthMaterial();
var material = new THREE.MeshBasicMaterial( { map: texture } );
// var material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );

var mesh = new THREE.Mesh(geometry, material);
// var mesh = new THREE.Points(geometry, material);



scene.add( mesh );

camera.position.z = 5;

mesh.rotation.z = 0.3;

var animate = function () {

    requestAnimationFrame( animate );

    mesh.rotateY(0.005);

    renderer.render( scene, camera );

};

animate();
