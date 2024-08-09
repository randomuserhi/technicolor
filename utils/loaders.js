import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../js3party/three/examples/jsm/libs/draco/");
loader.setDRACOLoader(dracoLoader);
const loadedGLTF = new Map();
const loadingGLTF = new Map();
export async function loadGLTF(path) {
    if (loadedGLTF.has(path)) {
        return new Promise((resolve) => {
            resolve(loadedGLTF.get(path));
        });
    }
    if (loadingGLTF.has(path)) {
        return loadingGLTF.get(path).promise;
    }
    let terminate = undefined;
    const promise = new Promise((resolve, reject) => {
        terminate = reject;
        loader.load(path, function (gltf) {
            try {
                const factory = () => gltf.scene.clone();
                loadedGLTF.set(path, factory);
                resolve(factory);
            }
            catch (error) {
                console.log(`Failed to load GLTF '${path}': ${error}`);
                reject(error);
            }
        }, undefined, function (error) {
            console.log(`Failed to load GLTF '${path}': ${error}`);
            reject(error);
        });
    });
    if (terminate !== undefined) {
        loadingGLTF.set(path, { promise, terminate });
    }
    else {
        console.warn("Unable to obtain termination from model loading promise. This shouldn't happen!");
    }
    return promise;
}
