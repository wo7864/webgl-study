import * as THREE from "https://cdn.skypack.dev/three@0.142.0";
// 무대 생성
const scene = new THREE.Scene();
const windowInnerWidth = window.innerWidth;
const windowInnerHeight = window.innerHeight;

const aspect = windowInnerWidth / windowInnerHeight;
//카메라 종횡비 설정
//(fov-field of view(시야), aspect-aspect ratio(종횡비), near(어디서부터), far(어디까지))
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

// 카메라 설치
// carmera.position.set(0,0,50);

const renderer = new THREE.WebGLRenderer();

// 화면 사이즈 설정
renderer.setSize(windowInnerWidth, windowInnerHeight);
// 바디에 넣기
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// cube.geometry.scale(1, 1, -1);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
