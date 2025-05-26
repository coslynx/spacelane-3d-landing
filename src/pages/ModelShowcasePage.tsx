import React, { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ModelLoader } from '../3d/ModelLoader';
import { ThreeScene } from '../3d/ThreeScene';
import MinimalLayout from '../layout/MinimalLayout';
import { Typography } from '../components/ui/common/Typography';
import { three3DHelpersUtil } from '../utils/three-helpers';
import '../styles/pages/model-showcase.css';

interface ModelShowcaseProps {
  modelPaths: string[];
}

const ModelShowcasePage: React.FC = () => {
  const modelPaths = useMemo(() => [
    '/models/test.glb',
    '/models/sphere.glb',
    '/models/cube.glb',
  ], []);

  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const { camera } = useThree();
  const controlsRef = useRef<THREE.OrbitControls>(null);

  const handleModelSelect = useCallback((index: number) => {
    setSelectedModelIndex(index);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const selectedModelPath = modelPaths[selectedModelIndex];

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedModelPath]);

  return (
    <MinimalLayout>
      <div className="model-showcase-container">
        <Typography variant="heading" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Interactive 3D Model Showcase
        </Typography>
        <div className="model-viewer">
          <Canvas>
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

export default ModelShowcasePage;