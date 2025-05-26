import React, { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useGLTF } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { Vector3 } from 'three';

interface ScrollSceneProps {
  modelPath: string;
  intensity?: number;
}

const ScrollScene: React.FC<ScrollSceneProps> = ({
  modelPath,
  intensity = 0.5,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();
  const { scrollY } = useScrollAnimation(groupRef);
  const { nodes, materials } = useGLTF(modelPath) as GLTF & {
    nodes: { [key: string]: THREE.Mesh };
    materials: { [key: string]: THREE.Material };
  };

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }
  }, [nodes]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollY / 5;
    }
  });

  return (
    <section className="w-full h-screen relative">
      <group ref={groupRef} position={[0, 0, 0]}>
        <ambientLight intensity={intensity} />
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];
          if (node instanceof THREE.Mesh) {
            return (
              <mesh
                key={key}
                geometry={node.geometry}
                material={materials[node.material.name]}
                castShadow
                receiveShadow
              />
            );
          }
          return null;
        })}
      </group>
    </section>
  );
};

export default ScrollScene;