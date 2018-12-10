var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 15000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// EVENTS
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
// /EVENTS

// -----------------------
// CHANGE PARAMETERS HERE:
// VARS
let verticalSegments = 64;
let horizontalSegments = 32;
let radius = 1;
let planetRadiusModifier = 1;
let orbitDistanceMultiplier = 0.4;
// /VARS
// -----------------------

// Private
let bodies = {};
// /Private

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
        
        mesh.material = new THREE.MeshBasicMaterial( { 
            map: texture,
        } );
        mesh.castShadows = false;
        mesh.receiveShadows = false;

    }

    mesh.scale.set( data.radius * planetRadiusModifier, data.radius * planetRadiusModifier, data.radius * planetRadiusModifier );
    mesh.rotateX( data.obliquity );

    return {
        mesh: mesh,
        data: data
    };

}

function calculateOrbit(data) {



}

function onKeyDown(e) {

    heldKeys[e.keyCode] = true;

}

function onKeyUp(e) {
    
    heldKeys[e.keyCode] = false;

}

function isKeyHeld(key) {

    if (typeof heldKeys[key] === undefined) {
        return false;
    } else {
        if (heldKeys[key]) {
            return true;
        } else {
            return false;
        }
    }

}

function handleCameraMovement() {
    // A
    if (isKeyHeld(65)) {
        camera.translateX(-1);
    }

    // D
    if (isKeyHeld(68)) {
        camera.translateX(1);
    }
    
    // W
    if (isKeyHeld(87)) {
        camera.translateZ(-1);
    }
    
    // S
    if (isKeyHeld(83)) {
        camera.translateZ(1);
    }
}

let heldKeys = [];

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
   "mercury": {
       radius: 1.752102291,
       parent: "sun",
       parentDist: 50,
       eccentricity: 0.20563,
       obliquity: 0.034,
       inclination: 0.05899212872,
       tidalLock: false
   },
   "venus": {
       radius: 2.250387126,
       parent: "sun",
       parentDist: 100,
       eccentricity: 0.0001181936969,
       obliquity: 3.095515961,
       inclination: 0.06736970913,
       tidalLock: false
   },
    "earth": {
        radius: 2.278579456,
        parent: "sun",
        parentDist: 150,
        eccentricity: 0.0002916200834,
        obliquity: 0.4090926295,
        inclination: 0.124878308,
        tidalLock: false
    },
   "moon": {
       radius: 1.043870767,
       parent: "earth",
       parentDist: 30,
       eccentricity: 0.0009581857593,
       obliquity: 0.02691995838,
       inclination: 0.08979719002,
       tidalLock: true
   },
    "mars": {
        radius: 1.932447031,
        parent: "sun",
        parentDist: 200,
        eccentricity: 0.001630137521,
        obliquity: 0.4396484386,
        inclination: 0.09861110274,
        tidalLock: false
    },
   "jupiter": {
       radius: 3.592448536,
       parent: "sun",
       parentDist: 300,
       eccentricity: 0.0008534660042,
       obliquity: 0.05462880559,
       inclination: 0.1062905514,
       tidalLock: false
   },
   "saturn": {
       radius: 3.492192715,
       parent: "sun",
       parentDist: 400,
       eccentricity: 0.0009861110274,
       obliquity: 0.4665265091,
       inclination: 0.09616764178,
       tidalLock: false
   },
   "uranus": {
       radius: 3.036304199,
       parent: "sun",
       parentDist: 500,
       eccentricity: 0.0008095011604,
       obliquity: 1.70640841,
       inclination: 0.1130973355,
       tidalLock: false
   },
   "neptune": {
       radius: 3.020062763,
       parent: "sun",
       parentDist: 600,
       eccentricity: 0.0001650383341,
       obliquity: 0.4942772442,
       inclination: 0.1122246709,
       tidalLock: false
   },

};

// Generating needed celestial bodies
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
function MakeSkybox() {
    let skyboxRadius = 3000;
    let skyboxTexture = new THREE.TextureLoader().load("textures/skybox.jpg");
    let material = new THREE.MeshBasicMaterial( {
        map: skyboxTexture
    } );
    material.side = THREE.BackSide;
    let skyboxMesh = new THREE.Mesh(geometry, material);
    skyboxMesh.scale.set(skyboxRadius, skyboxRadius, skyboxRadius);
    return skyboxMesh;
}
let skyboxMesh = MakeSkybox();
scene.add(skyboxMesh);

// Making sunlight
let light = new THREE.PointLight(0xffffff, 1.5);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 10000;
// let lensflare = MakeLensFlare(["lensflare0", "lensflare1"]);
// light.add(lensflare);
scene.add(light);

let tempXOffset = 0;
let tempZOffset = 0;
camera.position.set( tempXOffset, 50, 200 - tempZOffset );

// function MakeLensFlare(textureNames) {
//     let textures = [];
//     let textureLoader = new THREE.TextureLoader();

//     let lensflare = new THREE.LensFlare();

//     for (let i = 0; i < textureNames.length; i++) {
//         let texture = textureLoader.load("textures/fx/" + textureNames[i] + ".png")
//         textures.push(texture);
//         lensflare.addElement(new THREE.LensflareElement(texture, window.innerHeight, 0));
//     }

//     return lensflare;
// }

// MAIN LOOP
let animate = function () {

    requestAnimationFrame( animate );

    for(let name in bodies) {
        
        let body = bodies[name];

        body.mesh.rotateY(0.005);
        
        if (typeof body.data.parent !== 'undefined') {
            
            body.mesh.position.x = body.data.parentDist * orbitDistanceMultiplier;
            
        }

    }

    handleCameraMovement();
    camera.lookAt( tempXOffset, 0, 0 );
    
    renderer.render( scene, camera );

};

animate();
