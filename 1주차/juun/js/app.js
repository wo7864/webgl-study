// Find the latest version by visiting https://cdn.skypack.dev/three.

import * as THREE from "https://cdn.skypack.dev/three@0.142.0";
import { OrbitControls } from "./OrbitControls.js";

let camera, controls;
let renderer;
let scene;

init();
// animate();

function init() {
  scene = new THREE.Scene();
  // const container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // container.appendChild(renderer.domElement);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 0.01;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = -0.25;

  const textures = getTexturesFromAtlasFile("static/sun_temple_stripe.jpg", 6);

  const materials = [];
  for (let i = 0; i < 6; i++) {
    materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }));
  }
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, materials);
  cube.geometry.scale(1, 1, -1);
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener("resize", onWindowResize);
}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
  const textures = [];

  for (let i = 0; i < tilesNum; i++) {
    textures[i] = new THREE.Texture();
  }

  new THREE.ImageLoader().load(atlasImgUrl, (image) => {
    let canvas, context;
    const tileWidth = image.height;

    for (let i = 0; i < textures.length; i++) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage(
        image,
        tileWidth * i,
        0,
        tileWidth,
        tileWidth,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[i].image = canvas;
      textures[i].needsUpdate = true;
    }
  });

  return textures;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // required when damping is enabled

  renderer.render(scene, camera);
}
