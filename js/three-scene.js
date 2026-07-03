/* Three.js 3D Hero Background */
(function() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambient = new THREE.AmbientLight(0x404060, 0.8);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0x6366f1, 2, 50);
  point1.position.set(5, 5, 5);
  scene.add(point1);
  const point2 = new THREE.PointLight(0x06b6d4, 2, 50);
  point2.position.set(-5, -5, 5);
  scene.add(point2);
  const point3 = new THREE.PointLight(0x8b5cf6, 1.5, 50);
  point3.position.set(0, 0, -5);
  scene.add(point3);

  // Central Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.4, 200, 32);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.85,
    roughness: 0.15,
    emissive: 0x1a1a4a,
    emissiveIntensity: 0.4
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // Floating shapes
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.TetrahedronGeometry(0.35, 0),
    new THREE.BoxGeometry(0.4, 0.4, 0.4)
  ];
  const colors = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0xa78bfa];

  for (let i = 0; i < 16; i++) {
    const geo = geometries[i % geometries.length];
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      metalness: 0.7,
      roughness: 0.25,
      wireframe: i % 3 === 0
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = (Math.random() - 0.5) * 14;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 6 - 2;
    mesh.userData = {
      rotSpeed: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.005 + 0.002,
      floatOffset: Math.random() * Math.PI * 2
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Particles
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    knot.rotation.x = t * 0.2;
    knot.rotation.y = t * 0.3;

    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotSpeed;
      s.rotation.y += s.userData.rotSpeed * 1.2;
      s.position.y += Math.sin(t + s.userData.floatOffset) * s.userData.floatSpeed;
    });

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
