import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

const textureCache = new Map<string, THREE.Texture>();
const modelCache: Map<string, THREE.Object3D> = new Map();

const getCacheKey = (url: string, options?: {}): string => {
  const optionsString = options ? JSON.stringify(options) : '';
  return `${url}-${optionsString}`;
};

const getCachedModel = (cacheKey: string): THREE.Object3D | undefined => modelCache.get(cacheKey);

const cacheModel = (cacheKey: string, model: THREE.Object3D): void => {
  modelCache.set(cacheKey, model);
};

const addTexture = (url: string, texture: THREE.Texture): void => {
    textureCache.set(url, texture);
};
const loadModel = async (
  path: string,
  options?: {
    dracoDecoderPath?: string;
    ktx2TranscodersPath?: string;
    onLoad?: (model: THREE.Object3D) => void;
    onError?: (error: ErrorEvent) => void;
  }
): Promise<THREE.Object3D> => {
  return new Promise((resolve, reject) => {
    const cacheKey = getCacheKey(path, options);
    const cachedModel = getCachedModel(cacheKey);

    if (cachedModel) {
      resolve(cachedModel.clone());
      return;
    }

    const loader = new GLTFLoader();
    if (options?.dracoDecoderPath) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(options.dracoDecoderPath);
      dracoLoader.setDecoderConfig({ type: 'js' });
      loader.setDRACOLoader(dracoLoader);
    }
    if (options?.ktx2TranscodersPath) {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath(options.ktx2TranscodersPath);
      loader.setKTX2Loader(ktx2Loader);
    }
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      path,
      (gltf: GLTF) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        cacheModel(cacheKey, model);
        options?.onLoad?.(model);
        resolve(model.clone());
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
        options?.onError?.(error);
        reject(error);
      }
    );
  });
};

const disposeModel = (object: THREE.Object3D): void => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            material.dispose();
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.metalnessMap) material.metalnessMap.dispose();
          });
        } else {
          child.material.dispose();
          if (child.material.map) child.material.map.dispose();
          if (child.material.normalMap) child.material.normalMap.dispose();
          if (child.material.roughnessMap) child.material.roughnessMap.dispose();
          if (child.material.metalnessMap) child.material.metalnessMap.dispose();
        }
      }
    }
    if(child instanceof THREE.Light){
      child.dispose()
    }
  });
  object.removeFromParent();
};
export { loadModel, getCacheKey, getCachedModel, cacheModel, disposeModel, textureCache, addTexture };