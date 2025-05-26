/**
 * @file src/utils/three-helpers.ts
 * @description Provides utility functions and helper classes for common Three.js tasks, such as geometry creation, material management, scene manipulation, and optimized resource handling.
 */

import * as THREE from 'three';
import { sRGBEncoding } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Geometry Helpers
 */

/**
 * @function createBox
 * @description Creates a THREE.Mesh with THREE.BoxGeometry.
 * @param width Width of the box.
 * @param height Height of the box.
 * @param depth Depth of the box.
 * @param material Optional material for the mesh. Defaults to MeshStandardMaterial.
 * @returns A THREE.Mesh with BoxGeometry.
 */
const createBox = (width: number, height: number, depth: number, material?: THREE.Material): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  return new THREE.Mesh(geometry, material || new THREE.MeshStandardMaterial());
};

/**
 * @function createSphere
 * @description Creates a THREE.Mesh with THREE.SphereGeometry.
 * @param radius Radius of the sphere.
 * @param widthSegments Number of horizontal segments.
 * @param heightSegments Number of vertical segments.
 * @param material Optional material for the mesh. Defaults to MeshStandardMaterial.
 * @returns A THREE.Mesh with SphereGeometry.
 */
const createSphere = (radius: number, widthSegments: number = 32, heightSegments: number = 32, material?: THREE.Material): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  return new THREE.Mesh(geometry, material || new THREE.MeshStandardMaterial());
};

/**
 * @function createPlane
 * @description Creates a THREE.Mesh with THREE.PlaneGeometry.
 * @param width Width of the plane.
 * @param height Height of the plane.
 * @param material Optional material for the mesh. Defaults to MeshStandardMaterial.
 * @returns A THREE.Mesh with PlaneGeometry.
 */
const createPlane = (width: number, height: number, material?: THREE.Material): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  return new THREE.Mesh(geometry, material || new THREE.MeshStandardMaterial());
};

/**
 * Material Helpers
 */

/**
 * @interface MaterialOptions
 * @description Defines the options for creating a THREE.MeshStandardMaterial.
 */
interface MaterialOptions extends THREE.MeshStandardMaterialParameters { }

/**
 * @function createMaterial
 * @description Creates a THREE.MeshStandardMaterial with optional parameters.
 * @param options Optional parameters for the material.
 * @returns A THREE.MeshStandardMaterial.
 */
const createMaterial = (options?: MaterialOptions): THREE.Material => {
  try {
    return new THREE.MeshStandardMaterial(options);
  } catch (error) {
    console.warn('src/utils/three-helpers.ts: Error creating material, returning default material: ', error);
    return new THREE.MeshStandardMaterial();
  }
};

/**
 * @function loadTexture
 * @description Asynchronously loads a texture using THREE.TextureLoader.
 * @param path The path to the texture file.
 * @returns A Promise that resolves with the loaded THREE.Texture.
 */
const loadTexture = (path: string): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      path,
      (texture) => {
        texture.encoding = sRGBEncoding;
        texture.flipY = false;
        texture.generateMipmaps = true;
        resolve(texture);
      },
      undefined,
      (error) => {
        console.warn(`src/utils/three-helpers.ts: Error loading texture from ${path}:`, error);
        reject(error);
      }
    );
  });
};

/**
 * Scene Helpers
 */

/**
 * @function centerObject
 * @description Centers a 3D object at the origin (0, 0, 0).
 * @param object The THREE.Object3D to center.
 */
const centerObject = (object: THREE.Object3D): void => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
};
/**
 * @function setModelDracoCompression
 * @description Configures the GLTFLoader to use Draco compression.
 * @param loader The GLTFLoader instance.
 * @param dracoDecoderPath The path to the Draco decoder files.
 */
const setModelDracoCompression = (loader: THREE.GLTFLoader, dracoDecoderPath: string): void => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(dracoDecoderPath);
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);
};

/**
 * Math Helpers
 */

/**
 * @function generateUUID
 * @description Generates a unique identifier.
 * @returns A unique string ID.
 */
const generateUUID = (): string => {
    return THREE.MathUtils.generateUUID();
}

/**
 * Model Loading
 */

/**
 * @function loadModel
 * @description Loads a 3D model using THREE.GLTFLoader, with optional Draco compression.
 * @param path The path to the model file.
 * @param dracoDecoderPath Optional path to Draco decoder files for compressed models.
 * @returns A Promise that resolves with the loaded THREE.Group.
 */
const loadModel = async (path: string, dracoDecoderPath?: string): Promise<THREE.Group> => {
    return new Promise((resolve, reject) => {
        if (!path) {
            reject(new Error('Model path cannot be empty.'));
            return;
        }

        const loader = new GLTFLoader();
        if (dracoDecoderPath) {
            setModelDracoCompression(loader, dracoDecoderPath);
        }

        loader.load(
            path,
            (gltf: GLTF) => {
                const model = gltf.scene;
                centerObject(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error(`src/utils/three-helpers.ts: An error happened loading model: ${path}`, error);
                reject(error);
            }
        );
    });
};

/**
 * Memory Management
 */

/**
 * @function disposeObject
 * @description Recursively disposes of all resources (geometries, materials, textures) associated with a Three.js object to prevent memory leaks.
 * @param object The THREE.Object3D to dispose of.
 */
const disposeObject = (object: THREE.Object3D): void => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            disposeMaterial(material);
          });
        } else {
          disposeMaterial(child.material);
        }
      }
    }
    if(child instanceof THREE.Light){
      child.dispose()
    }
  });
  object.removeFromParent();
};
/**
 * @function disposeMaterial
 * @description Safely disposes of a THREE.Material and its textures.
 * @param material The THREE.Material to dispose.
 */
const disposeMaterial = (material: THREE.Material): void => {
    material.dispose();
    if (material.map) material.map.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
    if (material.aoMap) material.aoMap.dispose();
    if (material.emissiveMap) material.emissiveMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.alphaMap) material.alphaMap.dispose();
    if (material.envMap) material.envMap.dispose();
};

export const three3DHelpersUtil = {
  createBox,
  createSphere,
  createPlane,
  createMaterial,
  loadTexture,
  centerObject,
  loadModel,
  disposeObject,
  setModelDracoCompression,
  generateUUID
};
export { createBox, createSphere, createPlane, createMaterial, loadTexture, centerObject, loadModel, disposeObject, setModelDracoCompression, generateUUID };