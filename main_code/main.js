import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function init() {
  const scene = new THREE.Scene();
  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 3, -8);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const textureLoader = new THREE.TextureLoader();
  const SandBaseColor = textureLoader.load("./textures/Sand_007_basecolor.jpg");
  const SandNormalMap = textureLoader.load("./textures/Sand_007_normal.jpg");
  const SandHeight = textureLoader.load("./textures/Sand_007_height.png");
  const SandRoughnessMap = textureLoader.load(
    "./textures/Sand_007_roughness.jpg"
  );
  const SandAmbientOcclusionMap = textureLoader.load(
    "./textures/Sand_007_ambientOcclusion.jpg"
  );

  let meshPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40, 512, 512),
    new THREE.MeshStandardMaterial({
      map: SandBaseColor,
      normalMap: SandNormalMap,
      displacementMap: SandHeight,
      displacementScale: 0.25,
      roughnessMap: SandRoughnessMap,
      aoMap: SandAmbientOcclusionMap,
    })
  );
  meshPlane.rotation.x -= Math.PI / 2;
  meshPlane.geometry.attributes.uv2 = meshPlane.geometry.attributes.uv;
  meshPlane.receiveShadow = true;
  scene.add(meshPlane);

  let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.25),
    new THREE.MeshPhongMaterial({ color: 0xff4444, emissive: 0xffffff })
  );
  mesh.position.y += 2.25;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  let pointLight = new THREE.PointLight(0xffffff, 9);
  pointLight.position.y += 2.25;
  scene.add(pointLight);
  var ufo;
  var mtlLoader = new MTLLoader();
  mtlLoader.load("./objs/flying_Disk_flying.mtl", function (materials) {
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load("./objs/flying Disk flying.obj", function (mesh) {
      mesh.scale.set(0.015, 0.015, 0.015);

      mesh.position.y += 8;
      mesh.position.z += 2;

      ufo = mesh;
      scene.add(mesh);
    });
  });

  let castle = [
    // Corner left
    makecube(0.4, 2, 2, -3.5, 0, 1.5, scene),
    makecylinder(0.27, 2, -3.5, 0, 2.5, scene),
    makeCone(0.35, 0.5, -3.5, 1.22, 2.5, scene),
    makecylinder(0.27, 2, -2, 0, 2.5, scene),
    makeCone(0.35, 0.5, -2, 1.22, 2.5, scene),
    makecube(1.5, 2, 0.4, -2.9, 0, 2.5, scene),

    // Right Corner
    makecube(0.4, 2, 2, 3.5, 0, 1.5, scene),
    makecylinder(0.27, 2, 3.5, 0, 2.5, scene),
    makeCone(0.35, 0.5, 3.5, 1.22, 2.5, scene),
    makecylinder(0.27, 2, 1.9, 0, 2.5, scene),
    makeCone(0.35, 0.5, 1.9, 1.22, 2.5, scene),
    makecube(1.5, 2, 0.4, 2.7, 0, 2.5, scene),

    // Right Wall
    makecylinder(0.27, 2, 3.5, 0, 0.4, scene),
    makeCone(0.35, 0.5, 3.5, 1.22, 0.4, scene),
    makecube(0.4, 2, 2, 3.5, 0, -0.7, scene),
    makecylinder(0.27, 2, 3.5, 0, -1.8, scene),
    makeCone(0.35, 0.5, 3.5, 1.22, -1.8, scene),

    // Left Wall
    makecylinder(0.27, 2, -3.5, 0, 0.4, scene),
    makeCone(0.35, 0.5, -3.5, 1.22, 0.4, scene),
    makecube(0.4, 2, 2, -3.5, 0, -0.7, scene),
    makecylinder(0.27, 2, -3.5, 0, -1.8, scene),
    makeCone(0.35, 0.5, -3.5, 1.22, -1.8, scene),

    makeCone(0.35, 0.5, 0, 1.22, 2.5, scene),
    makecylinder(0.27, 2, 0, 0, 2.5, scene),
    makecube(4, 2, 0.4, 0, 0, 2.5, scene),
  ];

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  {
    const color = 0x1e00ff;
    const intensity = 0.3;
    const ambienLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambienLight);

    const light_gui = new GUI();
    light_gui.domElement.style.position = "flex";
    light_gui.domElement.style.top = "7rem";
    light_gui
      .addColor(new ColorGUIHelper(ambienLight, "color"), "value")
      .name("color");
    light_gui.add(ambienLight, "intensity", 0, 2, 0.01);
  }

  //   let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  //   scene.add(ambientLight);

  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-3, 2, -3);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 100;
  scene.add(directionalLight);

  let spotLight = new THREE.SpotLight(0x00ff37, 0.8);

  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.2; // Make the edge of the cone hard
  spotLight.distance = 500; // Set the distance the light shines
  spotLight.decay = 0; // Set the decay of the light
  spotLight.position.set(0, 5, 0); // Set the position of the light
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 100;
  scene.add(spotLight);

  var width = window.innerWidth;
  var height = window.innerHeight;
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  document.body.appendChild(renderer.domElement);

  {
    const textureLoader = new THREE.TextureLoader();
    const BrickBaseColor = textureLoader.load(
      "./textures/Wall_Stone_010_basecolor.jpg"
    );
    const BrickNormalMap = textureLoader.load(
      "./textures/Wall_Stone_010_normal.jpg"
    );
    const BrickHeight = textureLoader.load(
      "./textures/Wall_Stone_010_height.png"
    );
    const BrickRoughnessMap = textureLoader.load(
      "./textures/Wall_Stone_010_roughness.jpg"
    );
    const BrickAmbientOcclusionMap = textureLoader.load(
      "./textures/Wall_Stone_010_ambientOcclusion.jpg"
    );
    // Cone Dimensions
    const cone_geometry = new THREE.ConeGeometry(0.5, 0.8, 4);
    // Making texture loader

    const cone_material = new THREE.MeshStandardMaterial({
      color: 0x666655,
      map: BrickBaseColor,
      normalMap: BrickNormalMap,
      displacementMap: BrickHeight,
      displacementScale: 0.02,
      roughnessMap: BrickRoughnessMap,
      aoMap: BrickAmbientOcclusionMap,
    });
    // Making and adding the cone to the scene
    const cone = new THREE.Mesh(cone_geometry, cone_material);
    cone.rotation.y = Math.PI * -0.25;
    cone.position.set(0, 1, 0);
    cone.scale.set(5, 2.5, 5);
    cone.castShadow = true;
    cone.receiveShadow = true;
    scene.add(cone);
  }

  // Camera GUI and Orbit Controls
  {
    new OrbitControls(camera, renderer.domElement);

    function updateCamera() {
      camera.updateProjectionMatrix();
    }

    const gui = new GUI();
    gui.add(camera, "fov", 1, 180).onChange(updateCamera);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
    gui
      .add(minMaxGUIHelper, "min", 0.1, 50, 0.1)
      .name("near")
      .onChange(updateCamera);
    gui
      .add(minMaxGUIHelper, "max", 0.1, 50, 0.1)
      .name("far")
      .onChange(updateCamera);
  }

  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("./textures/sky2.jpg", () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      scene.background = texture;
    });
  }

  function makeCactus(x, y, z) {
    // Loading the mtl texture for the 3d model
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./textures/cactus.mtl", (mtl) => {
      mtl.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./objs/cactus.obj", (root) => {
        // Passing the obj outside of the nested block for later use
        const cactus = root;
        // Setting scale and adding to scene

        root.scale.set(0.005, 0.005, 0.005);
        root.position.set(x, y, z);
        root.rotation.x = Math.PI * -0.5;
        scene.add(root);
      });
    });
  }
  let cactuses = [
    makeCactus(-6, 0, 1.5),
    makeCactus(7, 0, 6),
    makeCactus(2, 0, -3.5),
    makeCactus(-2, 0, -2),
    makeCactus(0, 0, 5),
  ];

  let angle = 0;
  let angle2 = 0;

  let radius = 5;
  function animate() {
    requestAnimationFrame(animate);
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);

    angle += 0.001;
    angle2 += 0.01;

    // Calculate the new position of the light in a circle
    directionalLight.position.x = radius * Math.cos(angle);
    directionalLight.position.z = radius * Math.sin(angle);
    // spotLight.position.x = radius * Math.cos(angle2);
    // spotLight.position.z = radius * Math.sin(angle2);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    if (ufo && ufo.position) {
      ufo.position.y = Math.sin(angle2) * 0.5 + 3;
      spotLight.position.y = ufo.position.y + 2;
    }

    renderer.render(scene, camera);
  }

  animate();
}

function makecube(width, height, depth, x, y, z, scene) {
  const boxWidth = width;
  const boxHeight = height;
  const boxDepth = depth;

  const textureLoader = new THREE.TextureLoader();
  const BrickBaseColor = textureLoader.load(
    "./textures/Wall_Stone_010_basecolor.jpg"
  );
  const BrickNormalMap = textureLoader.load(
    "./textures/Wall_Stone_010_normal.jpg"
  );
  const BrickHeight = textureLoader.load(
    "./textures/Wall_Stone_010_height.png"
  );
  const BrickRoughnessMap = textureLoader.load(
    "./textures/Wall_Stone_010_roughness.jpg"
  );
  const BrickAmbientOcclusionMap = textureLoader.load(
    "./textures/Wall_Stone_010_ambientOcclusion.jpg"
  );

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth),
    new THREE.MeshStandardMaterial({
      map: BrickBaseColor,
      normalMap: BrickNormalMap,
      displacementMap: BrickHeight,
      displacementScale: 0.25,
      roughnessMap: BrickRoughnessMap,
      aoMap: BrickAmbientOcclusionMap,
    })
  );

  cube.receiveShadow = true;
  cube.castShadow = true;

  // Making the box and adding it to scene

  cube.position.set(x, y, z);
  scene.add(cube);
}

function makecylinder(radius, height, x, y, z, scene) {
  const textureLoader = new THREE.TextureLoader();
  const BrickBaseColor = textureLoader.load(
    "./textures/Wall_Stone_010_basecolor.jpg"
  );
  const BrickNormalMap = textureLoader.load(
    "./textures/Wall_Stone_010_normal.jpg"
  );
  const BrickHeight = textureLoader.load(
    "./textures/Wall_Stone_010_height.png"
  );
  const BrickRoughnessMap = textureLoader.load(
    "./textures/Wall_Stone_010_roughness.jpg"
  );
  const BrickAmbientOcclusionMap = textureLoader.load(
    "./textures/Wall_Stone_010_ambientOcclusion.jpg"
  );
  const cylinder_geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    32
  );
  const cylinder_material = new THREE.MeshStandardMaterial({
    map: BrickBaseColor,
    normalMap: BrickNormalMap,
    displacementMap: BrickHeight,
    displacementScale: 0.02,
    roughnessMap: BrickRoughnessMap,
    aoMap: BrickAmbientOcclusionMap,
  });

  // Making the Cylinder and setting it's position before adding to scene
  const cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.position.set(x, y, z);
  scene.add(cylinder);
}

function makeCone(radius, height, x, y, z, scene) {
  const textureLoader = new THREE.TextureLoader();
  const BrickBaseColor = textureLoader.load(
    "./textures/Wall_Stone_010_basecolor.jpg"
  );
  const BrickNormalMap = textureLoader.load(
    "./textures/Wall_Stone_010_normal.jpg"
  );
  const BrickHeight = textureLoader.load(
    "./textures/Wall_Stone_010_height.png"
  );
  const BrickRoughnessMap = textureLoader.load(
    "./textures/Wall_Stone_010_roughness.jpg"
  );
  const BrickAmbientOcclusionMap = textureLoader.load(
    "./textures/Wall_Stone_010_ambientOcclusion.jpg"
  );
  // Cone Dimensions
  const cone_geometry = new THREE.ConeGeometry(radius, height, 32);
  // Making texture loader
  const loader = new THREE.TextureLoader();
  // Loading textures
  const texture = loader.load("./textures/images.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  // Mapping the texture for the cone
  const cone_material = new THREE.MeshStandardMaterial({
    color: 0x444444,
    map: BrickBaseColor,
    normalMap: BrickNormalMap,
    displacementMap: BrickHeight,
    displacementScale: 0.02,
    roughnessMap: BrickRoughnessMap,
    aoMap: BrickAmbientOcclusionMap,
  });
  // Making and adding the cone to the scene
  const cone = new THREE.Mesh(cone_geometry, cone_material);
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.set(x, y, z);
  scene.add(cone);
}

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min; // this will call the min setter
  }
}

window.onload = init;
