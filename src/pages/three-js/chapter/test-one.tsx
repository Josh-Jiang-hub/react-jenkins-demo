import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//第一个3d场景，一个正方体，一个点光源

export default function TestOne() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    let renderer: THREE.WebGLRenderer;

    {
      const geometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);
    }

    {
      const pointLight = new THREE.PointLight(0xffffff, 10000);
      pointLight.position.set(80, 80, 80);
      scene.add(pointLight);
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
