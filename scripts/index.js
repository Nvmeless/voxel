import * as THREE from '../node_modules/three/build/three.module.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

let plane, sunlight;
let pointer, raycaster, isShiftDown = false;
let rollOverMesh, rollOverMaterial;
const objects = [];

let cubeGeo, cubeMaterial;
// instantiate a Cameras and Scenes
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3
camera.position.y = 1
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)



function loadPrefabentity(url, pos, rotate,urlTexture = null, path = null){
    let mtlLoader = new MTLLoader();
    if(path == null ){ 
        path = "assets/objs/";
    }
    if(urlTexture == null){ 
        urlTexture = url;
    }
    mtlLoader.load(path+ urlTexture + ".mtl", function( materials ) {
    
        materials.preload();
    
        let objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load(path + url + '.obj', function ( object ) {
    
                        object.position.z = pos.z;
                        object.rotation.z = rotate.z;
                        object.position.y = pos.y;
                        object.rotation.y = rotate.y;
                        object.position.x = pos.x;
                        object.rotation.x = rotate.x;
                        scene.add( object );
                        // objects.push(object)
    
        }, function(){}, function(){} );
    
    });
}

function generateSkyBoxMeshBasicMaterial(name){
    return [
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/right.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/left.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/top.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/bottom.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/back.png'),
            side: THREE.DoubleSide
        }),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('assets/skyboxes/'+name+'/front.png'),
            side: THREE.DoubleSide
        })
    ];
}

function init(){//Loading Assets
// loadPrefabentity('prop_floor_barrel',{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0});
// loadPrefabentity('prop_wall_big_door_wood',{x: 1, y: 0, z: 0},{x: 0, y: 0, z: 0});
// loadPrefabentity('prop_floor_crate',{x: -3, y: 0, z: 0},{x: 0, y: 0, z: 0});
// loadPrefabentity('prop_wall_big_door_iron',{x: -2, y: 0, z: 0},{x: 0, y: 0, z: 0});
// loadPrefabentity('prop_wall_torch',{x: 4, y: 2, z: 0},{x: 0, y: .80, z: 0});

//generate SkyBox
let geometry = new THREE.BoxGeometry(1000, 1000, 1000)
let skyBox = THREE.MeshFaceMaterial(generateSkyBoxMeshBasicMaterial("sand"))
let skyBoxEntity = new THREE.Mesh(geometry, skyBox)
scene.add(skyBoxEntity)

//Instantiate Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();


//Instantiate Lights 
const directionalLight = new THREE.DirectionalLight( 0xffffff, .0 );
directionalLight.position.x = -500;
directionalLight.position.z = 0;
directionalLight.position.y = 500;
scene.add( directionalLight );
sunlight = directionalLight.clone()
sunlight.position.x = 500;
sunlight.position.y = 500;
sunlight.position.z = 0;
sunlight.color.setHex(0xfffffff);
sunlight.intensity = .5
scene.add(sunlight) 


//grid
const gridHelper = new THREE.GridHelper( 1000, 1000 );
gridHelper.position.x = 0;
gridHelper.position.y = 0;
gridHelper.position.z = 0;
scene.add( gridHelper );

  //Helper helpers

  const rollOverGeo = new THREE.BoxGeometry( 1, 1, 1);
  rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
  rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  scene.add( rollOverMesh );

raycaster = new THREE.Raycaster();
pointer = new THREE.Vector2();
const planeGeometry = new THREE.PlaneGeometry( 1000, 1000 );
planeGeometry.rotateX( - Math.PI / 2 );

plane = new THREE.Mesh( planeGeometry, new THREE.MeshBasicMaterial( { visible: false } ) );
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;
scene.add( plane );
objects.push(plane)

cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
// cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );
cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c } );


document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener( 'pointerdown', onPointerDown );
// document.addEventListener( 'keydown', onDocumentKeyDown );
// document.addEventListener( 'keyup', onDocumentKeyUp );
// let ambientLight = new THREE.AmbientLight(0xFFFFFF, .5)
// scene.add(ambientLight) 
render();
}

function onPointerMove( event ) {

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        
        const intersect = intersects[ 0 ];
        console.log(intersect)
        console.log(intersect.point.y)
        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        // console.log(rollOverMesh.position.divideScalar( 1 ))
        // console.log(rollOverMesh.position.divideScalar( 1 ).floor())
        // console.log(rollOverMesh.position.divideScalar( 1 ).floor().multiplyScalar( 2 ))
        // console.log(rollOverMesh.position.divideScalar( 1 ).floor().multiplyScalar( 2 ).addScalar( .5 ))
        
        rollOverMesh.position.floor()
        rollOverMesh.position.y = Math.floor(intersect.point.y) + .5;
        if(rollOverMesh.position.y < 0){
            rollOverMesh.position.y = 0;
        }
        rollOverMesh.position.x = Math.floor(intersect.point.x) + .5;
        rollOverMesh.position.z = Math.floor(intersect.point.z) + .5;

    }

    render();

}

function onPointerDown( event ) {

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];

        // delete cube

        if ( isShiftDown ) {

            if ( intersect.object !== plane ) {

                scene.remove( intersect.object );

                objects.splice( objects.indexOf( intersect.object ), 1 );

            }

            // create cube

        } else {

            const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            
            voxel.position.divideScalar( 1 ).floor().multiplyScalar( 100 ).addScalar( 50 );
            scene.add( voxel );

            objects.push( voxel );

        }

        render();

    }

}

init();
//Processing

// function animate( ) {
// 
    // renderer.render(scene, camera)
    // requestAnimationFrame(animate)
// }  

function render() {

    renderer.render( scene, camera );

}
// animate()