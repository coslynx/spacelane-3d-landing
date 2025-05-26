import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { loadModel } from './modelManager';

/**
 * @file src/utils/sampleModelHelper.ts
 * @description Provides utility functions for loading and managing sample 3D models for demonstration and testing purposes *only*.
 * This module is NOT intended for production use.
 */

/**
 * @typedef SampleModelName
 * @description Represents the valid names for sample 3D models.
 */
export type SampleModelName = 'cube' | 'sphere' | 'test';

/**
 * @function getSampleModelPath
 * @description Returns the file path for a given sample model name.
 * @param modelName - The name of the sample model.
 * @returns The file path to the sample model's .glb file.
 * @throws Error - If an invalid modelName is provided.
 */
export const getSampleModelPath = (modelName: SampleModelName): string => {
  switch (modelName) {
    case 'cube':
      return '/models/cube.glb';
    case 'sphere':
      return '/models/sphere.glb';
    case 'test':
      return '/models/test.glb';
    default:
      throw new Error(`Invalid sample model name: ${modelName}`);
  }
};

/**
 * @function loadSampleModel
 * @description Asynchronously loads a sample 3D model by its name.
 * @param modelName - The name of the sample model to load.
 * @returns A Promise that resolves with the loaded THREE.Object3D.
 */
export const loadSampleModel = async (modelName: SampleModelName): Promise<THREE.Object3D> => {
  try {
    const modelPath = getSampleModelPath(modelName);
    const model = await loadModel(modelPath);
    return model;
  } catch (error: any) {
    console.error(`src/utils/sampleModelHelper.ts: Error loading sample model "${modelName}":`, error);
    throw new Error(`Failed to load sample model "${modelName}": ${error.message}`);
  }
};

//testing notes: Add a test, but this component is not intended for actual use.
//accessibility notes: Ensure that loading alternative text is used, if possible. Otherwise mark as decorative.
//security notes: Limited to local scope. Model calls are external, so all load paths have to checked.