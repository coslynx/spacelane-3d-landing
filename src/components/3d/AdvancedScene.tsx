import React, { Suspense, useRef, useEffect, useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, useGLTF } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, SSAO } from '@react-three/postprocessing';
import { MeshTransmissionMaterial } from 'three-stdlib';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';

interface AdvancedSceneProps {
  modelPath?: string;
  bloomIntensity?: number;
  depthOfField?: boolean;
  ssao?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

extend({ MeshTransmissionMaterial });

const AdvancedScene: React.FC<AdvancedSceneProps> = ({
  modelPath = '/models/sphere.glb',
  bloomIntensity = 1.5,
  depthOfField = false,
  ssao = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, gl, camera, size } = useThree();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { nodes, materials } = useGLTF(modelPath) as any;

  useEffect(() => {
    if (!gl) return;

    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputEncoding = THREE.sRGBEncoding;

    return () => {
      gl.toneMapping = THREE.NoToneMapping;
    };
  }, [gl]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <Suspense fallback={null}>
        <Environment preset="city" blur={0.8} />
        {nodes &&
          Object.keys(nodes).map((key) => {
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
        <EffectComposer multisampling={gl.capabilities.getMaxAnisotropy()}>
          <Bloom luminanceThreshold={0.9} intensity={bloomIntensity} />
          {depthOfField && <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />}
          {ssao && <SSAO />}
        </EffectComposer>
      </Suspense>
    </group>
  );
};

export default AdvancedScene;