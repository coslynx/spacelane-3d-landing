import React, { Suspense, useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, OrbitControls } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, SSAO } from '@react-three/postprocessing';
import { MeshTransmissionMaterial } from 'three-stdlib';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { ModelLoader } from '../../components/3d/ModelLoader';
import MinimalLayout from '../../components/layout/MinimalLayout';
import { Typography } from '../../components/ui/common/Typography';
import '../styles/pages/experience.css';

interface ExperiencePageProps {
  modelPath?: string;
  bloomIntensity?: number;
  depthOfField?: boolean;
  ssao?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const ExperiencePage: React.FC<ExperiencePageProps> = ({
  modelPath = '/models/test.glb',
  bloomIntensity = 0.8,
  depthOfField = true,
  ssao = true,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, gl, camera, size } = useThree();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const modelPaths = useMemo(() => [
    '/models/test.glb',
    '/models/sphere.glb',
    '/models/cube.glb',
  ], []);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const controlsRef = useRef<THREE.OrbitControls>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [performanceMultiplier, setPerformanceMultiplier] = useState(1);

  const handleModelSelect = (index: number) => {
    setSelectedModelIndex(index);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const selectedModelPath = modelPaths[selectedModelIndex];

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedModelPath]);

  useEffect(() => {
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

  const renderQuality = useCallback(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      gl.shadowMap.enabled = false;
      setQuality('low');
      setPerformanceMultiplier(0.5);
      return;
    }

    if (performanceMultiplier <= 0.5) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      gl.shadowMap.enabled = true;
      setQuality('medium');
      gl.shadowMap.type = THREE.PCFShadowMap;
      setPerformanceMultiplier(0.8);
      return;
    }
    if (performanceMultiplier > 0.8) {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      setQuality('high');
      setPerformanceMultiplier(1);
    }
  }, [gl]);

  return (
    <MinimalLayout>
      <div className="experience-container">
        <Typography variant="heading" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Immersive 3D Experience
        </Typography>
        <div className="model-viewer">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 45 }}>
            <ThreeScene cameraPosition={[0, 2, 5]}>
              <OrbitControls ref={controlsRef} target={[0, 1, 0]} maxDistance={10} minDistance={3} enablePan={false} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
              <Suspense fallback={<Typography variant="body">Loading model...</Typography>}>
                {selectedModelPath && <ModelLoader path={selectedModelPath} />}
              </Suspense>
            </ThreeScene>
          </Canvas>
        </div>
        <div className="model-selector">
          <Typography variant="body">Select a Model:</Typography>
          <ul className="model-list">
            {modelPaths.map((path, index) => (
              <li key={index} className="model-item">
                <button onClick={() => handleModelSelect(index)} className="model-button">
                  Model {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MinimalLayout>
  );
};

export default ExperiencePage;