import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { use3DInteraction } from '../../hooks/use3DInteraction';
import { Typography } from '../../components/ui/common/Typography';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { Button } from '../../components/ui/core/Button';
import { a, useSpring } from '@react-spring/three';

export interface LandingHeroProps {
  modelPath: string;
  headline: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({
  modelPath,
  headline,
  description,
  ctaText,
  onCtaClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { isDarkMode } = useTheme();
  const { scene } = useThree();

  const scrollSpring = useSpring({
    scale: 1,
    opacity: 1,
    from: { scale: 0.5, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const { nodes, materials } = useGLTF(modelPath) as GLTF & {
    nodes: { [key: string]: THREE.Mesh };
    materials: { [key: string]: THREE.Material };
  };

  use3DInteraction(groupRef, {
    onClick: (event) => {
      event.stopPropagation();
      console.log('Model clicked');
    },
  });

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <a.div style={scrollSpring} className="relative">
              <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                <Environment preset="sunset" background blur={0.8} />
                <group ref={groupRef} dispose={null}>
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
              </Canvas>
            </a.div>
          </div>
          <div className="md:order-1 flex flex-col justify-center">
            <Typography variant="display" style={{ marginBottom: '1rem' }}>
              {headline}
            </Typography>
            <Typography variant="body" style={{ marginBottom: '2rem' }}>
              {description}
            </Typography>
            <Button label={ctaText} onClick={onCtaClick} variant="primary" size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;