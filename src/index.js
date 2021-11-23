import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

import boilerVertexShader from './shaders/vertex.glsl'
import boilerFragmentShader from './shaders/fragment.glsl'


// Scene
const scene = new THREE.Scene()



//Stats
const stats = Stats()
document.body.appendChild(stats.dom)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    effect.setSize( sizes.width, sizes.height )


})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 15
camera.position.z = 15
scene.add(camera)




/**
 * Cube
 */
const cubeGeometry = new THREE.BoxGeometry(2.5,2.5,2.5)

const torusGeometry = new THREE.TorusGeometry( 8, 2, 16, 100 )


let shaderMaterial = null

shaderMaterial= new THREE.ShaderMaterial({
    side:THREE.DoubleSide,
    vertexShader:boilerVertexShader,
    fragmentShader:boilerFragmentShader,
    uniforms:{
        uTime:{value:0}
    }


})

const cube = new THREE.Mesh(cubeGeometry,shaderMaterial)
const torus = new THREE.Mesh(torusGeometry,shaderMaterial)

scene.add(cube,torus)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let effect = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } )
effect.setSize( sizes.width, sizes.height )
effect.domElement.style.color = 'yellow'
effect.domElement.style.backgroundColor = 'black'

effect.setSize( sizes.width, sizes.height )

document.body.appendChild( effect.domElement )

// Controls

const controls = new OrbitControls( camera, effect.domElement )
controls.enableDamping = true



/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    //Update shader with time
    shaderMaterial.uniforms.uTime.value = elapsedTime

    //Stats
    stats.update()

    cube.rotation.y = elapsedTime * 0.5
    cube.rotation.x = elapsedTime * 0.4


    torus.rotation.y= Math.sin(elapsedTime) 
    torus.rotation.x = elapsedTime * 0.5

    // Render
    effect.render(scene, camera) 

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()