import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

export function init(
  dom: HTMLElement | null,
  containerRef: React.RefObject<HTMLDivElement>,
  onSelected: (obj: any) => void,
  updateMeshInfo: (
    name: string,
    info: any,
    type: 'scale' | 'rotation' | 'position'
  ) => void
) {
  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(500, 400, 300);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const width = containerRef?.current?.clientWidth || 600;
  const height = window.innerHeight - 60;

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.set(500, 500, 500);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);

  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const v = new THREE.Vector2(window.innerWidth, window.innerWidth);
  const outlinePass = new OutlinePass(v, scene, camera);
  outlinePass.pulsePeriod = 1;
  composer.addPass(outlinePass);

  const gammaPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaPass);

  const transformControls = new TransformControls(camera, renderer.domElement);
  const transformHelper = transformControls.getHelper();
  scene.add(transformHelper);

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  transformControls.addEventListener('change', () => {
    const obj = transformControls.object;
    if (obj) {
      if (transformControls.mode === 'translate') {
        updateMeshInfo(obj.name, obj.position, 'position');
      } else if (transformControls.mode === 'scale') {
        updateMeshInfo(obj.name, obj.scale, 'scale');
      } else if (transformControls.mode === 'rotate') {
        updateMeshInfo(obj.name, obj.rotation, 'rotation');
      }
    }
  });

  transformControls.addEventListener('dragging-changed', function (event) {
    orbitControls.enabled = !event.value;
  });

  renderer.domElement.addEventListener('click', (e) => {
    const y = -((e.offsetY / height) * 2 - 1);
    const x = (e.offsetX / width) * 2 - 1;

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const objs = scene.children.filter((item) => {
      return item.name.startsWith('Box') || item.name.startsWith('Cylinder');
    });
    const intersections = rayCaster.intersectObjects(objs);

    if (intersections.length) {
      const obj = intersections[0].object;
      //   obj.material.color.set('green');
      outlinePass.selectedObjects = [obj];
      onSelected(obj);
      transformControls.attach(obj);
    } else {
      outlinePass.selectedObjects = [];
      onSelected(null);
      transformControls.detach();
    }
  });

  function render(time?: number) {
    composer.render();
    // renderer.render(scene, camera);
    requestAnimationFrame(render);
    transformControls.update(time);
  }

  render();

  dom?.append(renderer.domElement);

  // 设置变换控制器模式
  function setTransformControlsMode(mode) {
    transformControls.setMode(mode);
  }

  function transformControlsAttachObj(obj) {
    if (!obj) {
      transformControls.detach();
      return;
    }
    transformControls.attach(obj);
  }

  return {
    scene,
    setTransformControlsMode,
    transformControlsAttachObj,
  };
}
