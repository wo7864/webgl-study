import * as THREE from "https://cdn.skypack.dev/three@0.142.0";

const renderer = new THREE.WebGLRenderer();
windowInnerWidth = window.innerWidth;
windowInnerHeight = window.innerHeight;

const aspect = windowInnerWidth / windowInnerHeight;

renderer.setSize(windowInnerWidth, windowInnerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, aspect, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

// LineDashedMaterial
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);

scene.add(line);
renderer.render(scene, camera);
