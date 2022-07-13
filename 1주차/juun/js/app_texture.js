import * as THREE from "https://cdn.skypack.dev/three@0.142.0";

//장면
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x005fff);
//카메라
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 텍스쳐
const textureColor = new THREE.TextureLoader().load(
  "../static/img/Asphalt_006_COLOR.jpg"
);

const textureNormalMap = new THREE.TextureLoader().load(
  "../static/img/Asphalt_006_NRM.jpg"
);

const textureDisplacementMap = new THREE.TextureLoader().load(
  "../static/img/Asphalt_006_DISP.png"
);

const textureRoughnessMap = new THREE.TextureLoader().load(
  "../static/img/Asphalt_006_ROUGH.jpg"
);
//렌더러
// const canvas = document.querySelector("#canvas")
// const renderer = new THREE.WebGLRenderer({canvas});
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 빛
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 12);
scene.add(pointLight);

// 매쉬
const geometry01 = new THREE.BoxGeometry(0.8, 1, 1);
const material01 = new THREE.MeshStandardMaterial({
  map: textureColor,
  // metalness : 0,
  normalMap: textureNormalMap,
});

const obj01 = new THREE.Mesh(geometry01, material01);
obj01.position.x = -2;
scene.add(obj01);

// 매쉬
const geometry02 = new THREE.ConeGeometry(0.5, 1, 4);
const material02 = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  transparent: true,
  opacity: 0.8,
  normalMap: textureNormalMap,
  map: textureColor,
  displacementMap: textureDisplacementMap,
  displacementScale: 0.001,
  roughnessMap: textureRoughnessMap,
  roughness: 0.8,

  // wireframe: true
});
const obj02 = new THREE.Mesh(geometry02, material02);
scene.add(obj02);

// 매쉬
const geometry03 = new THREE.IcosahedronGeometry(0.5, 1);
const material03 = new THREE.MeshDepthMaterial({
  // color: 0x00ff00,
  metalness: 0.8,
  opacity: 1,
  roughness: 0.1,
  wireframe: true,
  // map: textureColor,
  // displacementMap: textureDisplacementMap,
  // displacementScale: 0.001,
  // roughnessMap: textureRoughnessMap
});
const obj03 = new THREE.Mesh(geometry03, material03);
obj03.position.x = 2;
scene.add(obj03);

camera.position.set(0, 0, 5);

// renderer.render(scene, camera)
function animate() {
  requestAnimationFrame(animate);

  // obj01.rotation.x += 0.01;
  obj01.rotation.y += 0.01;

  // obj02.rotation.x += 0.01;
  obj02.rotation.y += 0.01;

  // obj03.rotation.x += 0.01;
  obj03.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
// 반응형 처리
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
