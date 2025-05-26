import React, { Suspense, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Environment, OrbitControls } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from '../components/ui/common/Typography';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { Button } from '../components/ui/core/Button';
import MinimalLayout from '../components/layout/MinimalLayout';

interface AboutPageProps {}

const AboutPage: React.FC<AboutPageProps> = () => {
  const { isDarkMode } = useTheme();

  return (
    <MinimalLayout>
      <div className="flex flex-col items-center justify-center p-6">
        <Typography variant="heading" style={{ marginBottom: '1rem', textAlign: 'center' }}>
          About Our 3D SaaS Product
        </Typography>
        <div className="flex items-center justify-center">
          <ThreeScene cameraPosition={[0, 1, 3]}>
            <ModelLoader path="/models/test.glb" />
          </ThreeScene>
        </div>
        <Typography variant="body" style={{ marginTop: '2rem', textAlign: 'center', padding: '0 2rem' }}>
          Welcome to our innovative 3D SaaS product! We are dedicated to providing cutting-edge solutions for creating immersive experiences.
        </Typography>
        <Typography variant="body" style={{ marginTop: '1rem', textAlign: 'center', padding: '0 2rem' }}>
          Our platform empowers users to design, manage, and deploy stunning 3D content with ease.
        </Typography>
        <Typography variant="body" style={{ marginTop: '1rem', textAlign: 'center', padding: '0 2rem' }}>
          We leverage the latest technologies, including Three.js and React, to ensure unparalleled performance and visual fidelity.
        </Typography>
      </div>
    </MinimalLayout>
  );
};

export default AboutPage;