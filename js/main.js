/**
 *  01-Aug-2017  John Politis
 *  Description: 3D Model of the Earth. This model is used to process the Accelerometers / Gyro's
 *               data stream such that the Globe rotates.
 *
 *              The app will establish two streams and will process the data coming in, this is real time data
 *              from the MicroController.The MicroController used is the Beagle Bone development board on which
 *              a mpu6050 Sensor is attached to it on the I2C bus.The Accelerometers data will be displayed in a textarea
 *              that is visible on the top left hand of the screen.
 *
 *              The Globe will spin according to the movement of the sensor. 
 */

var app = app || {};

app.controller = {
  step: 0,
  rotationSpeed: 0.02,
  bouncingSpeed: 0.02,
  cameraPosIndex: 0,
  Sensor:'disconnect',

  numParticles: 2000,
  particleDistribution: 300

};

app.init = function(){

  app.scene = new THREE.Scene();
  app.width  = window.innerWidth;
  app.height = window.innerHeight;

  // 4 params:
  // field of view (FOV)
  // screen ratio
  // near field: how close to render things
  // far field:  how far to render thiings
  app.camera = new THREE.PerspectiveCamera(
    60, // FOV
    app.width / app.height, // screen ratio
    0.1, // near field
    5000 // far field
  );

  // Position our camera somewhere in the scene; it has a perspective
  app.camera.position.x = -30;
  app.camera.position.y = 40;
  app.camera.position.z = 30;

  // Tell the camera where its looking - at the center of the scene, the origin (0, 0, 0)
  app.camera.lookAt( app.scene.position );

  // The renderer calculates how the canvas/browser will see these elements, based on the camera position.
  // It also defines how it will do the rendering calculation under the hood, i.e. WebGL
  // hardware acceleration or fallback to a software renderer
  app.renderer = new THREE.WebGLRenderer();
  // set the size
  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0x000000 ); // background colour

  app.spotlight = app.createSpotlight();
  app.scene.add( app.spotlight );


  app.cube = app.createCube( 15, 15, 15, 6);
  app.scene.add( app.cube );

  app.sphere = app.createSphere();
  app.scene.add( app.sphere );

  app.moon = app.createMoon()
  app.scene.add( app.moon );

  app.ambient = new THREE.AmbientLight( 0x555555 );
  app.scene.add( app.ambient );

  app.particleSystem = app.createParticleSystem();
  app.scene.add( app.particleSystem );

  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

  app.gui = new dat.GUI();
  app.gui.add( app.controller, 'rotationSpeed', 0, 0.2 );
  app.gui.add(app.controller,'Sensor', [ 'connect', 'disconnect' ] );

  // Attach the canvas element created by the renderer onto the page
  document.getElementById("output").appendChild( app.renderer.domElement );
  app.stats = app.addStats();

  // Actually draw something
  app.animate();

}; // app.init


app.createParticleSystem = function(){

  // Particles are just a collection of vertices in a general-purpose geometry
  var particles = new THREE.Geometry();

  for (var i = 0; i < app.controller.numParticles; i++) {

    // position our particles in a range of i.e. -300 to 300
    var x = THREE.Math.randInt(-app.controller.particleDistribution, app.controller.particleDistribution );
    var y = THREE.Math.randInt(-app.controller.particleDistribution, app.controller.particleDistribution );
    var z = THREE.Math.randInt(-app.controller.particleDistribution, app.controller.particleDistribution );

    // Create a vertex
    var particle = new THREE.Vector3(x, y, z);

    // Add it to our particle system geometry
    particles.vertices.push( particle );
  } // for

  var particleMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 16,
    map: THREE.ImageUtils.loadTexture("/img/snowflake.png"),
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaTest: 0.5 // try values like 0 to 0.1 to see effect
  });

  var particleSystem = new THREE.Points( particles, particleMaterial );

  return particleSystem;
};


app.animateParticles = function(){

  var vertices = app.particleSystem.geometry.vertices;

  for (var i = 0; i < vertices.length; i++) {
    var vert = vertices[i];

    if( vert.y < -200 ){
      vert.y = app.controller.particleDistribution + THREE.Math.randInt(-50, 50);
    }

    vert.y -= app.controller.bouncingSpeed;

  } // for

    app.particleSystem.rotation.y -= app.controller.rotationSpeed;
    app.particleSystem.geometry.verticesNeedUpdate = true;

};


app.animate = function(){

  app.animateParticles();

  app.cube.rotation.x += app.controller.rotationSpeed;
  app.cube.rotation.y += app.controller.rotationSpeed;
  app.cube.rotation.z += app.controller.rotationSpeed;

  app.stats.update();

  app.controller.step += app.controller.bouncingSpeed;

  if(app.controller.Sensor === 'connect') {
      app.sphere.rotation.y += sensor.accelerometer.y / 100;
      app.sphere.rotation.x += sensor.accelerometer.x / 100;
      app.sphere.rotation.z += sensor.accelerometer.z / 100;
  }else {
      app.sphere.rotation.y += app.controller.rotationSpeed;
  }

  app.renderer.render( app.scene, app.camera );
  requestAnimationFrame( app.animate );

};

app.createSpotlight = function(){

  var spotlight = new THREE.SpotLight( 0xFFFFFF );
  spotlight.position.set( 30, 60, 10 );

  return spotlight;
};


app.createSphere = function(){

  var sphereGeometry = new THREE.SphereGeometry( 20, 40, 40 );  // radius, X and Y segments to approximate sphere with
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    side: THREE.DoubleSide,
    map: THREE.ImageUtils.loadTexture("/img/earth.jpg")
  });

  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

  sphere.position.set( 0, 0, 0 );
  sphere.castShadow = true;

  return sphere;
};


app.createMoon = function(){

  var sphereGeometry = new THREE.SphereGeometry(2, 50, 50 );  // radius, X and Y segments to approximate sphere with
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    side: THREE.DoubleSide,
    map: THREE.ImageUtils.loadTexture("/img/Moon.jpg")
  });

  var moon = new THREE.Mesh( sphereGeometry, sphereMaterial );

  moon.position.set( 0, 0, 0 );
  moon.castShadow = true;

  return moon;
};

app.createCube = function(x, y, z, size){

  var cubeGeometry = new THREE.BoxGeometry( size, size, size );
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF8F00,   // mustard cube, the culinary hit of the 4th millenium
    wireframe: false
  });

  var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

  cube.position.set( x, y, z );

  return cube;
};

app.createPlane = function(){

  var planeGeometry = new THREE.PlaneGeometry( 120, 20 );  // 120 x 20 plane (no height)
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xCFD8DB // a kind of dull grey
  });

  // combine shape and material into a final object, a mesh
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );

  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  plane.rotation.x = -0.5 *  Math.PI;  // don't ask... it's because of math(s)
  plane.receiveShadow = true;

  return plane;
};

app.addStats = function(){

  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.getElementById("stats").appendChild( stats.domElement );

  return stats;
}

app.onResize = function() {

  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize( app.width, app.height );
}

window.addEventListener( "resize", app.onResize, false);


window.onload = app.init;  // no jQuery today, but this is basically $(document).ready(function(){ ... })
