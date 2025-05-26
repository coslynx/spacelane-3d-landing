import React, { Suspense, useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { GLTF } from 'three-stdlib';
import { useTheme } from '../../context/ThemeContext';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { LinearEncoding, sRGBEncoding } from 'three';

export interface ModelLoaderProps {
  path: string;
  materialOverrides?: { [key: string]: THREE.Material };
  dracoDecoderPath?: string;
  ktx2TranscodersPath?: string;
  onLoad?: (model: THREE.Object3D) => void;
  onError?: (error: ErrorEvent) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  path,
  materialOverrides,
  dracoDecoderPath,
  ktx2TranscodersPath,
  onLoad,
  onError,
}) => {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const { scene, gl } = useThree();
  const { isDarkMode } = useTheme();

  const gltf = useLoader(
    GLTFLoader,
    path,
    (loader) => {
      if (dracoDecoderPath) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(dracoDecoderPath);
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);
      }
      if (ktx2TranscodersPath) {
        const ktx2Loader = new KTX2Loader();
        ktx2Loader.setTranscoderPath(ktx2TranscodersPath);
        ktx2Loader.detectSupport(gl.renderer);
        loader.setKTX2Loader(ktx2Loader);
      }
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
  );

  useEffect(() => {
    if (!gltf) return;

    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (materialOverrides) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material && child.material.name && materialOverrides[child.material.name]) {
          child.material = materialOverrides[child.material.name];
        }
      });
    }
    if (onLoad) {
      onLoad(gltf.scene);
    }
    // testing notes: Test that the model loads different types
  }, [gltf, materialOverrides, onLoad]);

  useEffect(() => {
    return () => {
      if (gltf) {
        three3DHelpersUtil.disposeObject(gltf.scene);
      }
    };
  }, [gltf]);

  return (
    <primitive object={gltf?.scene} dispose={null} />
  );
};

export default ModelLoader;