var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 500 );

var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// VARS
var verticalSegments = 64;
var horizontalSegments = 32;
var radius = 1;
// /VARS

//
// MAKING A SPHERE
//

// Calculating only one value to reduce overhead when generating geometry
let phi1 = 0;

var geometry = new THREE.BufferGeometry();
let geometryData = {
    normal: [],
    position: [],
    uv: []
};

// BUILDING SPHERE GEOMETRY
for (let i = 0; i < verticalSegments; i++) {

    let phi0 = phi1;
    phi1 = 2 * Math.PI * (i + 1) / verticalSegments;
    let theta1 = -Math.PI / 2;
    
    for (let j = 0; j < horizontalSegments; j++) {

        let theta0 = theta1;
        theta1 = -Math.PI / 2 + (Math.PI * (j + 1) / horizontalSegments);
        
        let quad = MakeQuad(
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

// TEMP
geometry = new THREE.SphereBufferGeometry( radius, verticalSegments, horizontalSegments);

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

function makePlanet(name, geometry, texture, data) {

    let mesh = new THREE.Mesh(geometry, undefined);
    
    if (name !== "sun") {

        mesh.material = new THREE.MeshPhongMaterial( {
            map: texture,
            shininess: 1
        } );
        mesh.castShadows = true;
        mesh.receiveShadows = true;

    } else {
        
        mesh.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        mesh.castShadows = false;
        mesh.receiveShadows = false;

    }

    mesh.scale.set( data.radius, data.radius, data.radius );
    mesh.rotateX( data.obliquity );

    return {
        mesh: mesh,
        data: data
    };

}

let bodies = {};

let bodiesData = {

    "sun": {
        radius: 4.853237307,
        parent: undefined,
        parentDist: 0,
        eccentricity: 0,
        obliquity: 0,
        inclination: 0,
        tidalLock: false
    },
//    "mercury": {
//        radius: 1,
//        parent: "sun",
//        parentDist: 1,
//        eccentricity: 1,
//        obliquity: 0,
//        inclination: 0,
//        tidalLock: false
//    },
   "venus": {
       radius: 2.250387126,
       parent: "sun",
       parentDist: 7,
       eccentricity: 1,
       obliquity: 0,
       inclination: 0,
       tidalLock: false
   },
    "earth": {
        radius: 2.278579456,
        parent: "sun",
        parentDist: 12,
        eccentricity: 1,
        obliquity: 0,
        inclination: 0,
        tidalLock: false
    },
//    "moon": {
//        radius: 1,
//        parent: "earth",
//        parentDist: 1,
//        eccentricity: 1,
//        obliquity: 0,
//        inclination: 0,
//        tidalLock: true
//    },
    "mars": {
        radius: 1.932447031,
        parent: "sun",
        parentDist: 17,
        eccentricity: 1,
        obliquity: 0,
        inclination: 0,
        tidalLock: false
    },
//    "jupiter": {
//        radius: 1,
//        parent: "sun",
//        parentDist: 1,
//        eccentricity: 1,
//        obliquity: 0,
//        inclination: 0,
//        tidalLock: false
//    },
   "saturn": {
       radius: 3.492192715,
       parent: "sun",
       parentDist: 24,
       eccentricity: 1,
       obliquity: 0,
       inclination: 0,
       tidalLock: false
   },
//    "uranus": {
//        radius: 1,
//        parent: "sun",
//        parentDist: 1,
//        eccentricity: 1,
//        obliquity: 0,
//        inclination: 0,
//        tidalLock: false
//    },
//    "neptune": {
//        radius: 1,
//        parent: "sun",
//        parentDist: 1,
//        eccentricity: 1,
//        obliquity: 0,
//        inclination: 0,
//        tidalLock: false
//    },

};

let tempCounter = -6;
for(let name in bodiesData) {

    if (bodiesData.hasOwnProperty(name)) {
        let texture = new THREE.TextureLoader().load("textures/"+name+".jpg");
        let body = makePlanet(name, geometry, texture, bodiesData[name]);
        
        let obj = {};
        obj[name] = body;

        bodies = Object.assign(bodies, obj );

        scene.add(body.mesh);
    }
}

// TEMP MAKING SKYBOX, Beautify later on
let skyboxTexture = new THREE.TextureLoader().load("textures/skybox.jpg");
let material = new THREE.MeshBasicMaterial( {
    map: skyboxTexture
} );
material.side = THREE.BackSide;
let skyboxMesh = new THREE.Mesh(geometry, material);
skyboxMesh.scale.set(100, 100, 100);
scene.add(skyboxMesh);

let light = new THREE.PointLight(0xffffff, 1.5);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 1000;

//let ambientLight = new THREE.AmbientLight(0xffffff, 0.05);

scene.add(light);
//scene.add(ambientLight);

camera.position.set( 0, 10, 35 );
camera.lookAt( -0, 0, 0 );

var animate = function () {

    requestAnimationFrame( animate );

    for(let name in bodies) {
        
        let body = bodies[name];

        body.mesh.rotateY(0.005);
        
        if (typeof body.data.parent !== 'undefined') {
            
            body.mesh.position.x = body.data.parentDist;
            
        }

    }

    renderer.render( scene, camera );

};

animate();
