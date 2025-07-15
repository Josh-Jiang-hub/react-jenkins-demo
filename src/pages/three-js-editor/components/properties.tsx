import { useThreeStore } from '@/pages/three-js-editor/store';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';
import Info from './properties-info';

export default function Properties() {
  const { setSelectedObjName, scene } = useThreeStore();

  const [treeData, setTreeData] = useState();

  useEffect(() => {
    if (scene?.children) {
      const tree = scene.children
        .map((item) => {
          if (item.isTransformControlsRoot) {
            return null;
          }

          return {
            title: item.isMesh ? item.geometry.type : item.type,
            key: item.type + item.name + item.id,
            name: item.name,
          };
        })
        .filter((item) => item !== null);
      //@ts-expect-error xxx
      setTreeData([
        {
          title: 'Scene',
          key: 'root',
          children: tree,
        },
      ]);
    }
  }, [scene]);

  function handleSelect(_, info: any) {
    const name = info.node.name;
    setSelectedObjName(name);
  }

  return (
    <div>
      <Tree
        treeData={treeData}
        expandedKeys={['root']}
        onSelect={handleSelect}
      />
      <Info />
    </div>
  );
}
