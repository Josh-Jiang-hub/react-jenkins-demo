import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//第一个3d场景，一个正方体，一个点光源

export default function TestOne() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    let renderer: THREE.WebGLRenderer;
    const gui = new GUI();

    {
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);
      const meshFolder = gui.addFolder('立方体');
      meshFolder.addColor(mesh.material, 'color');
      meshFolder.add(mesh.position, 'x').step(10);
      meshFolder.add(mesh.position, 'y').step(10);
      meshFolder.add(mesh.position, 'z').step(10);
    }

    {
      const pointLight = new THREE.PointLight(0xffffff, 10000);
      pointLight.position.set(80, 80, 80);
      scene.add(pointLight);
      const lightFolder = gui.addFolder('灯光');
      lightFolder.add(pointLight.position, 'x').step(10);
      lightFolder.add(pointLight.position, 'y').step(10);
      lightFolder.add(pointLight.position, 'z').step(10);
      lightFolder.add(pointLight, 'intensity').step(1000);
    }

    {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.set(200, 200, 200);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);

      // 清空容器並添加渲染器
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);
      function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();
      new OrbitControls(camera, renderer.domElement);
    }

    // 清理函數
    return () => {
      if (renderer) {
        renderer.dispose();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-js-container"
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
}
