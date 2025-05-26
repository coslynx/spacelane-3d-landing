import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Fog, Color, WebGLRenderer } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Stats } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';

interface ThreeSceneProps {
  bgColor?: string;
  cameraPosition?: [number, number, number];
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  ambientIntensity?: number;
  directionalIntensity?: number;
  directionalPosition?: [number, number, number];
  showStats?: boolean;
  children: React.ReactNode;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  bgColor = '#e0e0e0',
  cameraPosition = [0, 5, 10],
  fogColor = '#ffffff',
  fogNear = 10,
  fogFar = 50,
  ambientIntensity = 0.3,
  directionalIntensity = 0.8,
  directionalPosition = [1, 1, 1],
  showStats = false,
  children,
}) => {
  const sceneRef = useRef<THREE.Scene>(new Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { gl, size } = useThree();
  const { isDarkMode } = useTheme();
  const { animate } = use3DAnimation();

  useMemo(() => {
    const scene = sceneRef.current;
    scene.fog = new Fog(fogColor, fogNear, fogFar);
    scene.background = new Color(bgColor);
  }, [bgColor, fogColor, fogNear, fogFar]);

  useEffect(() => {
    const camera = cameraRef.current;
    camera.position.set(...cameraPosition);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [cameraPosition, size]);

  useFrame(() => {
    animate(0.01);
    gl.render(sceneRef.current, cameraRef.current);
  });

  const getCamera = useCallback(() => cameraRef.current, []);

  return (
    <>
      <AdaptiveDpr pixelated />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={directionalPosition} intensity={directionalIntensity} castShadow />
      {children}
      {showStats && <Stats />}
    </>
  );
};

export default ThreeScene;