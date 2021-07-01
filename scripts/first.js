/*const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const geometry = new THREE.BoxGeometry();
const roundGeom = new THREE.SphereGeometry(20/30, 48, 24);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const materiol = new THREE.MeshBasicMaterial( { color: 0x000000 } );
const cube = new THREE.Mesh( geometry, material );
const cubo = new THREE.Mesh( roundGeom, materiol );
// const materiol = new THREE.MeshLambertMaterial( {

//     color: new THREE.Color().setHSL( Math.random(), 0.5, 0.5 ),
//     side: THREE.DoubleSide,
//     clippingPlanes: clipPlanes,
//     clipIntersection: params.clipIntersection

// } );


scene.add( cube );
scene.add( cubo );


camera.position.z = 5;
// cubo.position.x += 1;
cubo.rotation.x += .75;
cubo.rotation.y += .75;
console.log(cube)
function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cubo.rotation.x -= 0.01;
    cubo.rotation.y -= 0.01;
    
	renderer.render( scene, camera );
}
animate();*/
import * as THREE from '../node_modules/three/build/three.module.js';
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const geometry = new THREE.TorusKnotGeometry( 9, .3, 300, 1,12,1 );
const material = new THREE.MeshBasicMaterial({ color: 0xf00f00, wireframe: true})
const cylinder = new THREE.Mesh(geometry, material)
cylinder.clone();
const light = new THREE.AmbientLight( 0x404040, 1 ); // soft white light
console.log(light)
scene.add( light );
// const light = new THREE.PointLight( 0xff0000, 1, 100 );
// light.position.set( 0, 0, 0 );
// scene.add( light );
scene.add(cylinder)

camera.position.z = 20
// scene.add(LightShadow(camera)) 
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
    


function animate() {
    // cylinder.rotation.x += 0.01
    cylinder.rotation.z += 0.01
    cylinder.rotation.y += 0.01
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()

