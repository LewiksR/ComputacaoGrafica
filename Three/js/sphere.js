var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 15000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

// EVENTS
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
window.addEventListener("resize", onWindowResize, false);
// /EVENTS

// -----------------------
// CHANGE PARAMETERS HERE:
// VARS
let verticalSegments = 128;
let horizontalSegments = 64;
let radius = 2;
let planetRadiusModifier = 1;
let planetRotationSpeedModifier = 2;
let orbitSpeedMultiplier = 0.00015;
let orbitDistanceMultiplier = 0.4;
// /VARS
// -----------------------

// Private
let bodies = {};

let bodiesData = {

    "sun": {
        radius: 4.853237307,
        parent: undefined,
        parentDist: 0,
        eccentricity: 0,
        obliquity: 0,
        inclination: 0,
        rotationSpeed: 3.992015968,
        tidalLock: false
    },
   "mercury": {
       radius: 1.752102291,
       parent: "sun",
       parentDist: 50,
       eccentricity: 0.20563,
       obliquity: 0.034,
       inclination: 0.05899212872,
       rotationSpeed: 0.07104290992,
       tidalLock: false
   },
   "venus": {
       radius: 2.250387126,
       parent: "sun",
       parentDist: 100,
       eccentricity: 0.0001181936969,
       obliquity: 3.095515961,
       inclination: 0.06736970913,
       rotationSpeed: 0.01714530647,
       tidalLock: false
   },
    "earth": {
        radius: 2.278579456,
        parent: "sun",
        parentDist: 150,
        eccentricity: 0.0002916200834,
        obliquity: 0.4090926295,
        inclination: 0.124878308,
        rotationSpeed: 4.184100418,
        tidalLock: false
    },
   "moon": {
       radius: 1.043870767,
       parent: "earth",
       parentDist: 15,
       eccentricity: 0.0009581857593,
       obliquity: 0.02691995838,
       inclination: 0.08979719002,
       rotationSpeed: 0,
       tidalLock: true
   },
    "mars": {
        radius: 1.932447031,
        parent: "sun",
        parentDist: 200,
        eccentricity: 0.001630137521,
        obliquity: 0.4396484386,
        inclination: 0.09861110274,
        rotationSpeed: 4.06504065,
        tidalLock: false
    },
   "jupiter": {
       radius: 3.592448536,
       parent: "sun",
       parentDist: 300,
       eccentricity: 0.0008534660042,
       obliquity: 0.05462880559,
       inclination: 0.1062905514,
       rotationSpeed: 10.1010101,
       tidalLock: false
   },
   "saturn": {
       radius: 3.492192715,
       parent: "sun",
       parentDist: 400,
       eccentricity: 0.0009861110274,
       obliquity: 0.4665265091,
       inclination: 0.09616764178,
       rotationSpeed: 9.345794393,
       tidalLock: false,
       rings: {
           innerRadius: 3,
           outerRadius: 5.5,
       }
   },
   "uranus": {
       radius: 3.036304199,
       parent: "sun",
       parentDist: 500,
       eccentricity: 0.0008095011604,
       obliquity: 1.70640841,
       inclination: 0.1130973355,
       rotationSpeed: 5.813953488,
       tidalLock: false
   },
   "neptune": {
       radius: 3.020062763,
       parent: "sun",
       parentDist: 600,
       eccentricity: 0.0001650383341,
       obliquity: 0.4942772442,
       inclination: 0.1122246709,
       rotationSpeed: 6.211180124,
       tidalLock: false
   },

};
// /Private

//
// MAKING A SPHERE
// Calculating only one value to reduce overhead when generating geometry
let phi1 = 0;

let sphereGeometry = new THREE.BufferGeometry();
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

sphereGeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(geometryData.normal), 3 ) );
sphereGeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(geometryData.position), 3 ) );
sphereGeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(geometryData.uv), 2 ) );

// TEMP
sphereGeometry = new THREE.SphereBufferGeometry( radius, verticalSegments, horizontalSegments);

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
            shininess: 3
        } );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (typeof data.rings !== 'undefined') {

            let ringMesh = new THREE.Mesh(
                new THREE.RingBufferGeometry(data.rings.innerRadius, data.rings.outerRadius, verticalSegments),
                new THREE.MeshPhongMaterial({
                    map: new THREE.TextureLoader().load("textures/"+name+"_rings.png"),
                    shininess: 3,
                    side: THREE.DoubleSide
                })
            );
            ringMesh.castShadow = false;
            ringMesh.receiveShadow = true;
            
            ringMesh.rotateX(Math.PI * 0.5);

            mesh.add(ringMesh)
            //scene.add(ringMesh);

        }

    } else {
        
        mesh.material = new THREE.MeshBasicMaterial( { 
            map: texture,
        } );
        mesh.castShadow = false;
        mesh.receiveShadow = false;

    }

    mesh.scale.set( data.radius * planetRadiusModifier, data.radius * planetRadiusModifier, data.radius * planetRadiusModifier );
    mesh.rotateX( data.obliquity );

    return {
        mesh: mesh,
        data: data
    };

}

function calculateOrbit(data) {

    let m = new Date().getTime();
    let angle = -m / (data.parentDist / orbitSpeedMultiplier) * 2 * Math.PI;
    let parentPos = bodies[data.parent].mesh.position;
    let position = new THREE.Vector3(
        parentPos.x + Math.cos(angle * 2 * Math.PI) * data.parentDist,
        0,
        parentPos.z + Math.sin(angle * 2 * Math.PI) * data.parentDist
    );
    
    return position;

}

function onKeyDown(e) {

    heldKeys[e.keyCode] = true;
    if (e.keyCode > 47 && e.keyCode < 58) {
        cameraTarget = Object.keys(bodies)[e.keyCode - 48];
        console.log("selecting " + Object.keys(bodies)[e.keyCode - 48]);
    }

}

function onKeyUp(e) {
    
    heldKeys[e.keyCode] = false;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

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

let heldKeys = [];

// Generating needed celestial bodies
for(let name in bodiesData) {

    if (bodiesData.hasOwnProperty(name)) {
        let texture = new THREE.TextureLoader().load("textures/"+name+".jpg");
        let body = makePlanet(name, sphereGeometry, texture, bodiesData[name]);
        
        let obj = {};
        obj[name] = body;

        bodies = Object.assign(bodies, obj);

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
    let skyboxMesh = new THREE.Mesh(sphereGeometry, material);
    skyboxMesh.scale.set(skyboxRadius, skyboxRadius, skyboxRadius);
    return skyboxMesh;
}
let skyboxMesh = MakeSkybox();
scene.add(skyboxMesh);

// Making sunlight
let light = new THREE.PointLight(0xffffff, 1.5);
light.castShadow = true;
light.receiveShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 10000;
light.shadow.bias = 0.00001;
light.shadowMapWidth = 4096;
light.shadowMapHeight = 4096;
// let lensflare = MakeLensFlare(["lensflare0", "lensflare1"]);
// light.add(lensflare);
scene.add(light);

let cameraTarget = "sun";
var controls = new THREE.OrbitControls( camera );
controls.panSpeed = 0;
controls.zoomSpeed = 5;
controls.update();
camera.position.set(0, 0, 100);

function MakeLensFlare(textureNames) {
    let textures = [];
    let textureLoader = new THREE.TextureLoader();

    let lensflare = new THREE.LensFlare();

    for (let i = 0; i < textureNames.length; i++) {
        let texture = textureLoader.load("textures/fx/" + textureNames[i] + ".png")
        textures.push(texture);
        lensflare.addElement(new THREE.LensflareElement(texture, window.innerHeight, 0));
    }

    return lensflare;
}

// MAIN LOOP
let animate = function () {

    requestAnimationFrame( animate );

    for(let name in bodies) {
        
        let body = bodies[name];

        body.mesh.rotateY(body.data.rotationSpeed * 0.001 * planetRotationSpeedModifier);
        
        if (typeof body.data.parent !== 'undefined') {
            
            //body.mesh.position.x = body.data.parentDist * orbitDistanceMultiplier;
            let bodyTargetPos = calculateOrbit(body.data);
            body.mesh.position.set(bodyTargetPos.x, bodyTargetPos.y, bodyTargetPos.z);
            
        }

        if (body.data.tidalLock) {
            body.mesh.lookAt(bodies[body.data.parent].mesh.position);
        }

    }

    let targetPos = bodies[cameraTarget].mesh.position;
    controls.target.set(targetPos.x, targetPos.y, targetPos.z);

    controls.update();
    
    renderer.render( scene, camera );

};

animate();
