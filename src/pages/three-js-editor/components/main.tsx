import { useEffect, useRef, type RefObject } from 'react';
import { init } from '../util/init';
import { MeshTypes, useThreeStore } from '@/pages/three-js-editor/store';
import type { Object3D, Scene } from 'three';
import * as THREE from 'three';
import { FloatButton } from 'antd';
import {
  ArrowsAltOutlined,
  DragOutlined,
  RetweetOutlined,
} from '@ant-design/icons';

export default function Main() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    setSelectedObj,
    selectedObj,
    removeMesh,
    updateMeshInfo,
    setScene,
    selectedObjName,
  } = useThreeStore();
  const sceneRef = useRef<Scene | undefined>(undefined);
  const transformControlsModeRef = useRef<unknown>(undefined);
  const transformControlsAttachObjRef = useRef<unknown>(undefined);

  function onSelected(obj: Object3D) {
    setSelectedObj(obj);
  }

  useEffect(() => {
    const dom = document.getElementById('threejs-container');
    const { scene, setTransformControlsMode, transformControlsAttachObj } =
      init(
        dom,
        containerRef as RefObject<HTMLDivElement>,
        onSelected,
        updateMeshInfo
      );
    sceneRef.current = scene;
    transformControlsModeRef.current = setTransformControlsMode;
    transformControlsAttachObjRef.current = transformControlsAttachObj;
    setScene(scene);
    return () => {
      if (dom) {
        dom.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Backspace' && selectedObj) {
        if (typeof transformControlsAttachObjRef.current === 'function') {
          transformControlsAttachObjRef.current(null);
        }
        sceneRef.current?.remove(selectedObj);
        removeMesh(selectedObj.name);
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [selectedObj]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    data.meshArr.forEach((item) => {
      if (item.type === MeshTypes.Box) {
        const {
          width,
          height,
          depth,
          material: { color },
          position,
          scale,
          rotation,
        } = item.props;
        let mesh = scene.getObjectByName(item.name);

        if (!mesh) {
          const geometry = new THREE.BoxGeometry(width, height, depth);
          const material = new THREE.MeshPhongMaterial({
            color,
          });
          mesh = new THREE.Mesh(geometry, material);
        }

        mesh.name = item.name;
        mesh.position.copy(position);
        mesh.scale.copy(scale);
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;
        if (mesh instanceof THREE.Mesh) {
          mesh.material.color = new THREE.Color(color);
        }
        scene.add(mesh);
      } else if (item.type === MeshTypes.Cylinder) {
        const {
          radiusTop,
          radiusBottom,
          height,
          material: { color },
          position,
          scale,
          rotation,
        } = item.props;
        let mesh = scene.getObjectByName(item.name);

        if (!mesh) {
          const geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height
          );
          const material = new THREE.MeshPhongMaterial({
            color,
          });
          mesh = new THREE.Mesh(geometry, material);
        }
        mesh.name = item.name;
        mesh.position.copy(position);
        mesh.scale.copy(scale);
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;
        if (mesh instanceof THREE.Mesh) {
          mesh.material.color = new THREE.Color(color);
        }
        scene.add(mesh);
      }
    });
    setScene(scene.clone());
  }, [data]);

  const setMode = (mode: 'translate' | 'rotate' | 'scale') => {
    if (typeof transformControlsModeRef.current === 'function') {
      transformControlsModeRef.current?.(mode);
    }
  };

  useEffect(() => {
    if (selectedObjName) {
      const obj = sceneRef.current?.getObjectByName(selectedObjName);
      console.log(obj);
      if (!obj) return;
      setSelectedObj(obj);
      if (typeof transformControlsAttachObjRef.current === 'function') {
        transformControlsAttachObjRef.current(obj);
      }
    }
  }, [selectedObjName]);

  return (
    <div className="relative">
      <div ref={containerRef} id="threejs-container"></div>
      <FloatButton.Group className="absolute top-0 left-0 w-[100px] h-[200px]">
        <FloatButton
          icon={<DragOutlined />}
          onClick={() => setMode('translate')}
        />
        <FloatButton
          icon={<RetweetOutlined />}
          onClick={() => setMode('rotate')}
        />
        <FloatButton
          icon={<ArrowsAltOutlined />}
          onClick={() => setMode('scale')}
        />
      </FloatButton.Group>
    </div>
  );
}
