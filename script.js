/* ═══════════════════════════════════════════════════════════
   RAKIBUL HASAN ANTOR — PORTFOLIO JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════
   1. THREE.JS — 3D BACKGROUND SCENE
════════════════════════════════════════ */

const canvas = document.getElementById('three-canvas');

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


/* ── Floating Particles ── */
const particleGeo = new THREE.BufferGeometry();
const count = 1800;
const positions = new Float32Array(count * 3);
const colors    = new Float32Array(count * 3);

const palette = [
  [0,    0.96, 1   ],   // cyan
  [0.48, 0.23, 1   ],   // violet
  [1,    0.18, 0.47],   // pink
];

for (let i = 0; i < count; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3]     = c[0];
  colors[i * 3 + 1] = c[1];
  colors[i * 3 + 2] = c[2];
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.035,
  vertexColors: true,
  transparent: true,
  opacity: 0.7,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);


/* ── Glowing 3D Orbs ── */
const orbData = [
  { color: 0x7c3aff, x: -3,  y:  2,   z: -3, r: 1.2, speed: 0.003 },
  { color: 0x00f5ff, x:  3,  y: -1.5, z: -2, r: 0.9, speed: 0.002 },
  { color: 0xff2d78, x:  0,  y: -2.5, z: -4, r: 0.7, speed: 0.004 },
  { color: 0x00f5ff, x: -2,  y: -3,   z: -1, r: 0.5, speed: 0.005 },
  { color: 0x7c3aff, x:  4,  y:  3,   z: -3, r: 0.6, speed: 0.003 },
];

const orbs = orbData.map(d => {
  const geo  = new THREE.SphereGeometry(d.r, 32, 32);
  const mat  = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.12 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(d.x, d.y, d.z);
  mesh.userData = { ox: d.x, oy: d.y, speed: d.speed, t: Math.random() * Math.PI * 2 };
  scene.add(mesh);
  return mesh;
});


/* ── Wireframe Icosahedron ── */
const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
const icoMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.06 });
const ico    = new THREE.Mesh(icoGeo, icoMat);
ico.position.set(0, 0, -1);
scene.add(ico);


/* ── Torus Ring ── */
const torusGeo = new THREE.TorusGeometry(2.5, 0.006, 8, 100);
const torusMat = new THREE.MeshBasicMaterial({ color: 0x7c3aff, transparent: true, opacity: 0.15 });
const torus    = new THREE.Mesh(torusGeo, torusMat);
torus.rotation.x = Math.PI / 3;
scene.add(torus);


/* ── Mouse Parallax ── */
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});


/* ── Animation Loop ── */
let t = 0;

function animate() {
  requestAnimationFrame(animate);
  t += 0.005;

  // Rotate particles
  particles.rotation.y = t * 0.05;
  particles.rotation.x = t * 0.02;

  // Spin icosahedron
  ico.rotation.y += 0.003;
  ico.rotation.x += 0.001;

  // Spin torus
  torus.rotation.z += 0.002;
  torus.rotation.y += 0.001;

  // Float orbs
  orbs.forEach(orb => {
    orb.userData.t += orb.userData.speed;
    orb.position.x = orb.userData.ox + Math.sin(orb.userData.t) * 0.8;
    orb.position.y = orb.userData.oy + Math.cos(orb.userData.t * 0.7) * 0.6;
  });

  // Smooth parallax camera
  camera.position.x += (mouseX *  0.4 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();


/* ── Resize Handler ── */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


/* ════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════ */

const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0;
let rx = 0, ry = 0;

// Move dot cursor instantly
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 5 + 'px';
  cursor.style.top  = my - 5 + 'px';
});

// Lag ring cursor smoothly
(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx - 17 + 'px';
  ring.style.top  = ry - 17 + 'px';
  requestAnimationFrame(animRing);
})();

// Scale cursor on hover
const hoverTargets = 'a, button, .glass-card-3d, .skill-card, .project-card, .contact-card, .stat-card, .info-chip, .role-tag';

document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform    = 'scale(2.5)';
    ring.style.transform      = 'scale(1.6)';
    ring.style.borderColor    = 'rgba(0,245,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform    = 'scale(1)';
    ring.style.transform      = 'scale(1)';
    ring.style.borderColor    = 'rgba(0,245,255,0.5)';
  });
});


/* ════════════════════════════════════════
   3. 3D CARD TILT ON MOUSE MOVE
════════════════════════════════════════ */

function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(20px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });

  });
}

addTilt('.skill-card');
addTilt('.project-card');
addTilt('.contact-card');
addTilt('.stat-card');


/* ════════════════════════════════════════
   4. SCROLL REVEAL ANIMATION
════════════════════════════════════════ */

const reveals  = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {

        // Show element
        entry.target.classList.add('visible');

        // Animate skill bars inside revealed elements
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });

      }, i * 120);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));
