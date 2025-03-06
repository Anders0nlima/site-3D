// Configuração da cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf0f0f0);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Adicionando luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100); 
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Carregando o modelo .glb
const loader = new THREE.GLTFLoader();
let model;
loader.load(
  'assets/cinema_camera_with_simple_tripod.glb', 
  (gltf) => {
    model = gltf.scene; // Obtém o modelo 3D
    scene.add(model); // Adiciona o modelo à cena

    // Ajuste a posição, rotação e escala do modelo
    model.position.set(0, 1, 0); 
    model.scale.set(0.7, 0.7, 0.7); 
    model.rotation.set(0, 0, 0); 

    console.log('Modelo carregado com sucesso!', model);
  },
  undefined, 
  (error) => {
    console.error('Erro ao carregar o modelo:', error);
  }
);

// Posicionando a câmera
camera.position.z = 5; 

// Configuração do ScrollTrigger
gsap.to(camera.position, {
  scrollTrigger: {
    trigger: "#content", // Elemento que dispara o scroll
    start: "top top", // Inicia quando o topo do #content atingir o topo da viewport
    end: "bottom bottom", // Termina quando o fundo do #content atingir o fundo da viewport
    scrub: 0.1, // Suaviza a animação conforme o scroll
    onUpdate: (self) => {
      const progress = self.progress; // Progresso do scroll (0 a 1)
      const angle = progress * Math.PI * 2; // Converte o progresso em ângulo (0 a 2π)
      camera.position.x = Math.sin(angle) * 5; // Move a câmera em um círculo ao redor do modelo
      camera.position.z = Math.cos(angle) * 5;
      camera.lookAt(0, 0, 0); // Mantém a câmera olhando para o centro
    },
  },
});

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Ajustar o tamanho da cena ao redimensionar a janela
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// Animação dos curtas-metragens
gsap.utils.toArray(".curta-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: card.classList.contains("right") ? 100 : -100, // Começa fora da tela
      },
      {
        opacity: 1,
        x: 0, // Move para o centro
        scrollTrigger: {
          trigger: card,
          start: "top 90%", // Inicia a animação quando o card estiver a 90% da viewport
          end: "top 20%", // Termina a animação quando o card estiver a 20% da viewport
          scrub: true, // Suaviza a animação conforme o scroll
        },
      }
    );
  });