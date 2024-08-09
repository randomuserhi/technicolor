import { html, Macro, MacroElement } from "@/rhu/macro.js";
import { Style } from "@/rhu/style.js";
import { Color, ColorRepresentation, DirectionalLight, DoubleSide, Euler, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PerspectiveCamera, PointLight, Quaternion, ReinhardToneMapping, Scene, SRGBColorSpace, Vector2, VSMShadowMap, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Text } from "troika-three-text";
import { createDerivedMaterial } from "troika-three-utils";
import { Bezier } from "../utils/bezier.js";
import { loadGLTF } from "../utils/loaders.js";
import { BokehPass } from "./BokehPass.js";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial.js";

declare global {
    interface Math {
        clamp(value: number, min: number, max: number): number;
        clamp01(value: number): number;
        repeat(t: number, length: number): number;
        deltaAngle(current: number, target: number): number;
        deg2rad: number;
        rad2deg: number;
    }
}

Math.deg2rad = Math.PI / 180.0;
Math.rad2deg = 180.0 / Math.PI;

Math.clamp = function (value, min, max) {
    return Math.min(max, Math.max(value, min));
};
Math.clamp01 = function (value) {
    return Math.clamp(value, 0, 1);
};

const style = Style(({ style }) => {
    const wrapper = style.class`
    width: 100%;
    height: 100%;
    position: relative;
    `;
    /*style`
    @media screen and (max-width: 780px) {
        ${wrapper} {
            padding: 0px 7px;
        }
    }
    `;*/

    const canvas = style.class`
    display: block;
    width: 100%;
    height: 100%;
    `;
    style`
    ${canvas}:focus {
        outline: none;
    }
    `;

    return {
        wrapper,
        canvas
    };
});

export class Camera {
    root: PerspectiveCamera;

    constructor(fov: number, aspect: number, near: number = 0.1, far: number = 1000) {
        this.root = new PerspectiveCamera(fov, aspect, near, far);
        this.root.rotation.order = "YXZ";
    }

    public resize(width: number, height: number) {
        this.root.aspect = width / height;
        this.root.updateProjectionMatrix();
    }
}

const SCENE_SCALE = 0.005;
const tmpMaterial = createDerivedMaterial(
    new MeshBasicMaterial({ side: DoubleSide }),
    {
        vertexTransform: `
        position.x *= -1.0;
        `
    }
);
export const flower = Macro(class Flower extends MacroElement {
    private canvas: HTMLCanvasElement;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private composer: EffectComposer;

    private bloom: UnrealBloomPass;
    private bokeh: BokehPass;

    private camera: Camera;
    private flower: Group;
    private gears: Mesh[] = [];
    private drive: Group;

    private root: Group;

    private lines: { model: Group, length: number }[] = [];
    
    constructor(dom: Node[], bindings: any) {
        super(dom, bindings);

        window.addEventListener("resize", () => {
            this.resize();
        });
        this.canvas.addEventListener("mount", () => this.resize());

        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.composer = new EffectComposer(this.renderer);

        this.scene.background = new Color(0x0);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = VSMShadowMap; //PCFSoftShadowMap;
        this.renderer.toneMapping = ReinhardToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.outputColorSpace = SRGBColorSpace;

        this.camera = new Camera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.scene.add(this.camera.root);
        
        this.composer.addPass(new RenderPass(this.scene, this.camera.root));
        this.composer.addPass(this.bloom = new UnrealBloomPass(new Vector2(this.canvas.width, this.canvas.height), 0.05, 1, 0.9));
        this.composer.addPass(this.bokeh = new BokehPass(this.scene, this.camera.root, {
            focus: 60 * SCENE_SCALE,
            aperture: 0.025,
            maxblur: 0.01,
        }));
        this.composer.addPass(new OutputPass());

        const pointLight = new PointLight(0xFFFFFF, 10, undefined, 0.25);
        this.camera.root.add(pointLight);
        pointLight.position.set(0, 0, 0);

        const light = new DirectionalLight(0xFFFFFF, 10);
        light.position.set(0, 10, 0);
        this.scene.add(light);

        const root = this.root = new Group();
        root.position.set(-120, -135, 0).multiplyScalar(SCENE_SCALE);
        root.rotation.set(45 * Math.deg2rad, -55 * Math.deg2rad, 0, "YXZ");
        this.scene.add(root);
        
        const flower = this.flower = new Group();
        root.add(flower);
        const drive = this.drive = new Group();
        root.add(drive);

        loadGLTF("./js3party/models/gears.glb").then((factory) => {
            for (let i = 0; i < 6; ++i) {
                const inner = factory();
                inner.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);
            
                const innerMaterial = new MeshPhysicalMaterial({
                    color: 0x3f7ee8,
                    emissive: 0x3f7ee8,
                    emissiveIntensity: 2.5,
                    ior: 1.5,
                    specularIntensity: 1,
                    specularColor: 0xffffff,
                });

                inner.traverse((obj: Object3D) => {
                    const mesh = obj as Mesh;
                    if (mesh.isMesh === true) {
                        mesh.material = innerMaterial;
                        mesh.scale.set(0.9, 0.9, 0.9);
                        this.gears.push(mesh);
                    }
                });

                flower.add(inner);

                const outer = factory();
                outer.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);

                const outerMaterial = Object.assign(new MeshTransmissionMaterial(10), {
                    clearcoat: 1,
                    clearcoatRoughness: 0.1,
                    transmission: 1,
                    chromaticAberration: 1,
                    anisotrophicBlur: 0.3,
                    // Set to > 0 for diffuse roughness
                    roughness: 0,
                    thickness: 10,
                    ior: 1.5
                });

                outer.traverse((obj: Object3D) => {
                    const mesh = obj as Mesh;
                    if (mesh.isMesh === true) {
                        mesh.material = outerMaterial;
                        this.gears.push(mesh);
                    }
                });

                flower.add(outer);

                const rotation = new Quaternion();
                rotation.setFromEuler(new Euler(0, 0, i * 60 * Math.deg2rad, "YXZ"));

                inner.quaternion.copy(rotation);
                outer.quaternion.copy(rotation);
            }
        });

        loadGLTF("./js3party/models/pushrod.glb").then((factory) => {
            const model = factory();
            model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);

            const material = new MeshPhysicalMaterial({
                color: 0x6490d9,
                emissive: 0x0f5ad9,
                emissiveIntensity: 15,
                ior: 1.5,
                specularIntensity: 1,
                specularColor: 0xffffff,
            });

            model.traverse((obj: Object3D) => {
                const mesh = obj as Mesh;
                if (mesh.isMesh === true) {
                    mesh.material = material;
                }
            });

            drive.add(model);
        });

        loadGLTF("./js3party/models/screwinner.glb").then((factory) => {
            const model = factory();
            model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);

            const material = new MeshPhysicalMaterial({
                color: 0x3f7ee8,
                emissive: 0x3f7ee8,
                emissiveIntensity: 2.5,
                ior: 1.5,
                specularIntensity: 1,
                specularColor: 0xffffff,
            });

            model.traverse((obj: Object3D) => {
                const mesh = obj as Mesh;
                if (mesh.isMesh === true) {
                    mesh.material = material;
                }
            });

            drive.add(model);
        });

        loadGLTF("./js3party/models/screwouter.glb").then((factory) => {
            const model = factory();
            model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);

            const material = Object.assign(new MeshTransmissionMaterial(10), {
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                transmission: 1,
                chromaticAberration: 0.2,
                anisotrophicBlur: 0.5,
                // Set to > 0 for diffuse roughness
                roughness: 0,
                thickness: 5,
                ior: 1.5
            });

            model.traverse((obj: Object3D) => {
                const mesh = obj as Mesh;
                if (mesh.isMesh === true) {
                    mesh.material = material;
                }
            });

            drive.add(model);
        });

        loadGLTF("./js3party/models/sleeve.glb").then((factory) => {
            const model = factory();
            model.scale.set(SCENE_SCALE, SCENE_SCALE, SCENE_SCALE);
            
            const material = Object.assign(new MeshTransmissionMaterial(10), {
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                transmission: 1,
                chromaticAberration: 1,
                anisotrophicBlur: 0.3,
                // Set to > 0 for diffuse roughness
                roughness: 0,
                thickness: 10,
                ior: 1.5
            });

            model.traverse((obj: Object3D) => {
                const mesh = obj as Mesh;
                if (mesh.isMesh === true) {
                    mesh.material = material;
                }
            });

            flower.add(model);
        });

        const position = {
            x: 0,
            y: 0,
            z: -150 * SCENE_SCALE
        };

        const rotation = {
            x: 0,
            y: 180 * Math.deg2rad,
            z: 0
        };

        this.camera.root.position.copy(position);
        this.camera.root.rotation.set(rotation.x, rotation.y, rotation.z, "YXZ");

        const background: [start: string, end: string, repetition: number, color: ColorRepresentation][] = [
            ["T", "RANSFORM", 8, 0xff0000],
            ["E", "NGINEER", 9, 0xff5300],
            ["C", "HANGE", 10, 0xffa500],
            ["H", "YBRID", 11, 0xffd200],
            ["N", "ATURE", 10, 0xffff00],
            ["I", "NVENT", 11, 0x80c000],
            ["C", "ATALYSE", 9, 0x008000],
            ["O", "PERATE", 9, 0x004080],
            ["L", "EAGUE", 9, 0x0000ff],
            ["O", "BEISM", 10, 0x2600c1],
            ["R", "UMBLE", 10, 0x4b0082],
        ];

        this.lines = new Array(background.length);
        for (let i = 0; i < background.length; ++i) {
            const args = background[i]; 
            const model = new Group();
            const left = this.createText(...args);
            const right = this.createText(...args);
            left.addEventListener("synccomplete", () => {
                const bounds = (left as any).textRenderInfo.blockBounds;
                const width = (bounds[2] - bounds[0]);
                left.position.x = width / -2;
                this.lines[i].length = width;

                const height = (bounds[3] - bounds[1]);
                model.position.y = (background.length - i - 1) * height - height * background.length / 2;
            });
            right.addEventListener("synccomplete", () => {
                const bounds = (right as any).textRenderInfo.blockBounds;
                right.position.x = (bounds[2] - bounds[0]) / 2;
            });
            model.add(left, right);
            this.lines[i] = {
                model,
                length: 0
            };
            this.scene.add(model);
        }

        window.addEventListener("mousemove", (event) => {
            const x = event.clientX / window.innerWidth;
            const y = event.clientY / window.innerHeight;

            position.x = (-0.5 + x * 1) * SCENE_SCALE;
            position.y = (-0.5 + y * 1) * SCENE_SCALE;

            rotation.x = (-0.5 - x * 1) * Math.deg2rad * SCENE_SCALE;
            rotation.y = Math.PI + (-0.5 + y * 1) * Math.deg2rad * SCENE_SCALE;

            this.camera.root.position.copy(position);
            this.camera.root.rotation.set(rotation.x, rotation.y, rotation.z, "YXZ");
        });

        this.render();
    }

    private createText(start: string, end: string, repetition: number, color: ColorRepresentation) {
        const tmp = new Text();
        tmp.font = "./fonts/microgramma/microgramma.otf";
        tmp.fontSize = 47 * SCENE_SCALE;
        tmp.textAlign = "center";
        tmp.anchorX = "center";
        tmp.anchorY = "bottom";
        tmp.material = tmpMaterial;
        this.scene.add(tmp);
        
        tmp.colorRanges = {};

        let string = "";
        for (let i = 0; i < repetition; ++i) {
            if (i % 2 === 0) (tmp.colorRanges as any)[string.length] = color;
            string += start;
            (tmp.colorRanges as any)[string.length] = 0x010101;
            string += end;
        }

        tmp.text = string;
        tmp.position.set(0, 0, 180 * SCENE_SCALE);

        return tmp;
    }

    private resize() {
        const computed = getComputedStyle(this.canvas);
        const width = parseInt(computed.width);
        const height = parseInt(computed.height);

        this.camera.resize(width, height);
        this.renderer.setSize(width, height, false);
        this.bloom.setSize(width, height);
        this.bokeh.setSize(width, height);
        this.composer.setSize(width, height);

        this.bokeh.uniforms.aspect.value = 3440 / 1440;

        if (width > 1000) {
            this.root.position.x = -130 * SCENE_SCALE;
        } else {
            this.root.position.x = -110 * SCENE_SCALE;
        }
    }

    private time: number = 0;
    private prevTime?: number = undefined;
    private render() {
        const now = Date.now();
        if (this.prevTime === undefined) {
            this.prevTime = now;
        }
        const dt = (now - this.prevTime) / 1000;
        this.prevTime = now;
        this.time += dt;

        this.composer.render();

        const scrollDuration = 25;
        const t = this.time % scrollDuration / scrollDuration;
        for (const line of this.lines) {
            line.model.position.x = (1 - t) * line.length - line.length / 2;
        }

        const sway = 3.5;

        const introDuration = 2;
        if (this.time > introDuration) {
            const duration = 240;
            const t = this.time - introDuration;

            this.flower.rotation.set(0, 0, ((t % duration) / duration) * 2 * Math.PI, "YXZ");
            
            for (let i = 0; i < this.gears.length; i += 2) {
                const inner = this.gears[i];
                const outer = this.gears[i + 1];

                //const offset = (i / 2) * Math.PI / 3;
                const offset = 0;
                const angle = Math.sin(t + offset) * sway * Math.deg2rad;
                
                inner.rotation.set(angle, 0, 0, "YXZ");
                outer.rotation.set(angle, 0, 0, "YXZ");
            }

            this.drive.position.set(0, 0, Math.sin(t + Math.PI) * 0.5 * SCENE_SCALE);
        } else {
            const duration = introDuration;
            const t = this.time / duration;

            const ease = easeOut(t);
            this.flower.rotation.set(0, 0, (1 - ease) * -3 * Math.PI, "YXZ");

            const easeSlow = easeOutSlow(t);
            for (let i = 0; i < this.gears.length; i += 2) {
                const inner = this.gears[i];
                const outer = this.gears[i + 1];

                //const offset = (i / 2) * Math.PI / 3;
                const offset = 0;
                const angle1 = Math.sin(offset) * sway * Math.deg2rad;
                const angle2 = (1 - easeSlow) * -62 * Math.deg2rad;

                inner.rotation.set(angle1 + angle2, 0, 0, "YXZ");
                outer.rotation.set(angle1 + angle2, 0, 0, "YXZ");
            }

            this.drive.position.set(0, 0, (1 - easeSlow) * 5 * SCENE_SCALE);
        }

        requestAnimationFrame(() => this.render());
    }

}, html`
    <div m-id="wrapper" class="${style.wrapper}">
        <canvas m-id="canvas" class="${style.canvas}"></canvas>
    </div>
    `);

const easeOut = Bezier(0, 0.9, 0.005, 0.999);
const easeOutSlow = Bezier(.31,.73,.7,.99);