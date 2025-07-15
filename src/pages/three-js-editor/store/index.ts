import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function createBox() {
  const newId = Math.random().toString().slice(2, 8);
  return {
    id: newId,
    type: 'Box',
    name: 'Box' + newId,
    props: {
      width: 200,
      height: 200,
      depth: 200,
      material: {
        color: 'orange',
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  };
}

function createCylinder() {
  const newId = Math.random().toString().slice(2, 8);
  return {
    id: newId,
    type: 'Cylinder',
    name: 'Cylinder' + newId,
    props: {
      radiusTop: 200,
      radiusBottom: 200,
      height: 300,
      material: {
        color: 'orange',
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  };
}

export interface CommonProps {
  data: {
    meshArr: any[];
  };
  addMesh: (type: string) => void;
  selectedObj: any;
  setSelectedObj: (obj: any) => void;
  removeMesh: (name: string) => void;
  updateMeshInfo: (
    name: string,
    info: any,
    type: 'scale' | 'rotation' | 'position'
  ) => void;
  scene: any;
  setScene: (obj: any) => void;
  selectedObjName: string;
  setSelectedObjName: (name: string) => void;
  updateMaterial: (name: string, info: Record<string, any>) => void;
}

const useThreeStore = create<CommonProps>()(
  persist(
    (set) => {
      return {
        data: {
          meshArr: [],
        },
        addMesh(type) {
          function addItem(creator) {
            set((state) => {
              return {
                data: {
                  ...state.data,
                  meshArr: [...state.data.meshArr, creator()],
                },
              };
            });
          }
          if (type === 'Box') {
            addItem(createBox);
          } else if (type === 'Cylinder') {
            addItem(createCylinder);
          }
        },
        selectedObj: null,
        setSelectedObj(obj: any) {
          set({
            selectedObj: obj,
          });
        },
        removeMesh(name) {
          set((state) => {
            return {
              data: {
                ...state.data,
                meshArr: state.data.meshArr.filter((mesh) => {
                  return mesh.name !== name;
                }),
              },
            };
          });
        },
        updateMeshInfo(
          name: string,
          info: any,
          type: 'scale' | 'rotation' | 'position'
        ) {
          set((state) => {
            return {
              data: {
                ...state.data,
                meshArr: state.data.meshArr.map((mesh) => {
                  if (mesh.name === name) {
                    if (type === 'position') {
                      mesh.props.position = info;
                    } else if (type === 'scale') {
                      mesh.props.scale = info;
                    } else if (type === 'rotation') {
                      mesh.props.rotation = {
                        x: info.x,
                        y: info.y,
                        z: info.z,
                      };
                    }
                  }
                  return mesh;
                }),
              },
            };
          });
        },
        scene: null,
        setScene(obj: any) {
          set({
            scene: obj,
          });
        },
        selectedObjName: '',
        setSelectedObjName(name) {
          set({
            selectedObjName: name,
          });
        },
        updateMaterial(name: string, info: Record<string, any>) {
          set((state) => {
            return {
              data: {
                ...state.data,
                meshArr: state.data.meshArr.map((mesh) => {
                  if (mesh.name === name) {
                    mesh.props.material = {
                      ...mesh.props.material,
                      ...info,
                    };
                  }
                  return mesh;
                }),
              },
            };
          });
        },
      };
    },
    {
      name: 'three-js-editor',
    }
  )
);

const MeshTypes = {
  Box: 'Box',
  Cylinder: 'Cylinder',
};

export { useThreeStore, MeshTypes };
