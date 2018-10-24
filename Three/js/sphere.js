//textureLoader.Load(['earth.jpg']);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 2.5, 7.5 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BufferGeometry();

// VARS
var resolution = 16;
var verticalSegments = 16;
var horizontalSegments = 16;
var radius = 2;
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
            vertex01[0], vertex01[1], vertex01[2],
            vertex10[0], vertex10[1], vertex10[2],
        ],
        uv: []
    };

}

function MakeQuad(vertex00, vertex01, vertex10, vertex11) {

    let triangleA = MakeTriangle(vertex00, vertex01, vertex10);
    let triangleB = MakeTriangle(vertex01, vertex11, vertex10);

    return {
        normal: triangleA.normal.concat(triangleB.normal),
        position: triangleA.position.concat(triangleB.position),
        uv: triangleA.uv.concat(triangleB.uv)
    };

}
var test;

let geometryData = {
    normal: [],
    position: [],
    uv: []
};

for (let i = 0; i < verticalSegments; i++) {

    let phi0 = 2 * Math.PI * i / verticalSegments;
    let phi1 = 2 * Math.PI * (i + 1) / verticalSegments;
    
    for (let j = 0; j < horizontalSegments; j++) {

        let theta0 = -Math.PI / 2 + (Math.PI * j / horizontalSegments);
        let theta1 = -Math.PI / 2 + (Math.PI * (j + 1) / horizontalSegments);
        
        quad = MakeQuad(
            SphereVertexAsArray( radius, theta0, phi0 ),
            SphereVertexAsArray( radius, theta0, phi1 ),
            SphereVertexAsArray( radius, theta1, phi0 ),
            SphereVertexAsArray( radius, theta1, phi1 ));

        if (i == 0 && j == 0) { console.log(quad); }

        geometryData.normal = geometryData.normal.concat(quad.normal);
        geometryData.position = geometryData.position.concat(quad.position);
        geometryData.uv = geometryData.uv.concat(quad.uv);
        
    }
}

geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(geometryData['normal']), 3 ) );
geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(geometryData.position), 3 ) );
//geometry.addAttribute( 'uv', new THREE.BufferAttribute( geometryData['uv'], 3 ) );



geometry = new THREE.SphereBufferGeometry(2, 16, 16);

var material = new THREE.MeshDepthMaterial();
//var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
// var material = new THREE.PointsMaterial( { color: 0xffffff, size: 0.1 } );

var mesh = new THREE.Mesh(geometry, material);
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
