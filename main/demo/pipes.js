var conf, scene, camera, light, objects, renderer;
var whw, whh;
var mouseX, mouseY;

const gridSize = 20;
const cellSize = 2;
const tubeSize = cellSize;
const minHeight = 10;
const maxHeight = 80;
const heightD = maxHeight - minHeight;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  conf = {
    lightAnimation: true,
    lightColorAnimation: true,
    lightIntensity: 10,
    material: {
      color: 0x707070,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x808080,
      emissiveIntensity: 0
    }
  };

  initScene();

  const gui = new dat.GUI();
  gui.add(conf, 'lightAnimation');
  gui.add(conf, 'lightColorAnimation');
  gui.add(conf, 'lightIntensity', 0, 50);

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
};

function initScene() {
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  light = new THREE.PointLight(conf.lightColor, conf.lightIntensity, 70);
  scene.add(light);

  camera.position.z = 100;

  objects = [];
  for (var i = 0; i < gridSize; i++) {
    let x = (-gridSize / 2 + i) * cellSize;
    for (var j = 0; j < gridSize; j++) {
      let y = (-gridSize / 2 + j) * cellSize;
      let c = cylinder(tubeSize / 2, tubeSize / 2 * 0.85, 1);
      c.position.x = x;
      c.position.y = y;
      c.scale.z = minHeight + Math.random() * heightD;
      scene.add(c);
      objects.push(c);
    }
  }

  shuffle();
}

function shuffle() {
  for (var i = 0; i < objects.length; i++) {
    tweenCylinder(objects[i]);
  }
}

function animate() {
  requestAnimationFrame(animate);

  light.intensity = conf.lightIntensity;

  var time = Date.now() * 0.0005;
  if (conf.lightAnimation) {
    light.position.x = Math.sin(time * 1) * gridSize;
    light.position.y = Math.cos(time * 1.7) * gridSize;
    light.position.z = (Math.cos(time * 1.5) + 1) * 10 + 100;
  }
  if (conf.lightColorAnimation) {
    light.color.r = (Math.cos(time * 0.5) + 1) / 2;
    light.color.g = (Math.cos(time * 0.1) + 1) / 2;
    light.color.b = (Math.sin(time * 0.8) + 1) / 2;
  }

  renderer.render(scene, camera);

  stats.update();
};

function tweenCylinder(c) {
  TweenLite.to(c.scale, 5, {
    z: minHeight + Math.random() * heightD,
    ease: Power2.easeInOut,
    onComplete: tweenCylinder,
    onCompleteParams: [c]
  });
}

function cylinder(outer, inner, depth) {
  var arcShape = new THREE.Shape();
  arcShape.absarc(0, 0, outer, 0, Math.PI * 2, 0, false);

  var holePath = new THREE.Path();
  holePath.absarc(0, 0, inner, 0, Math.PI * 2, true);
  arcShape.holes.push(holePath);

  var extrudeSettings = {
    depth: depth,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 30
  };

  var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
  var m = { ...conf.material }; //, color: Math.random()*0xffffff };
  var material = new THREE.MeshStandardMaterial(m);
  return new THREE.Mesh(geometry, material);
}

function onWindowResize() {
  whw = window.innerWidth / 2;
  whh = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - whw;
  mouseY = event.clientY - whh;
}