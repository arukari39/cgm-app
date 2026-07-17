//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private light!: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true;

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = (_time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };

    // シーンの作成
    private createScene = () => {
        this.scene = new THREE.Scene();

        const addSceneFromObjFile = async (objPath: string, mtlPath: string) => {
            const meshStr = await readFile(objPath);
            const kdColor = await readKdColor(mtlPath);

            let vertices: number[] = [];
            let vertexIndices: number[] = [];

            const meshLines = meshStr.split("\n");

            for (let i = 0; i < meshLines.length; ++i) {
                const meshLine = meshLines[i].trim();
                const meshSpaceSplitArray = meshLine.split(/\s+/);

                const meshType = meshSpaceSplitArray[0];

                if (meshType === "v") {
                    vertices.push(parseFloat(meshSpaceSplitArray[1]));
                    vertices.push(parseFloat(meshSpaceSplitArray[2]));
                    vertices.push(parseFloat(meshSpaceSplitArray[3]));
                } else if (meshType === "f") {
                    const f1 = meshSpaceSplitArray[1].split("/");
                    const f2 = meshSpaceSplitArray[2].split("/");
                    const f3 = meshSpaceSplitArray[3].split("/");

                    vertexIndices.push(parseInt(f1[0]) - 1);
                    vertexIndices.push(parseInt(f2[0]) - 1);
                    vertexIndices.push(parseInt(f3[0]) - 1);
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array(vertices), 3)
            );
            geometry.setIndex(vertexIndices);
            geometry.computeVertexNormals();

            const material = new THREE.MeshBasicMaterial({
                color: kdColor
            });

            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
        };

        addSceneFromObjFile("./src/tri_mat.obj", "./src/tri_mat.mtl");

        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        const update: FrameRequestCallback = (_time) => {
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}

async function readFile(path: string): Promise<string> {
    return new Promise((resolve) => {
        const loader = new THREE.FileLoader();

        loader.load(path, (data) => {
            if (typeof data === "string") {
                resolve(data);
            } else {
                const decoder = new TextDecoder("utf-8");
                const decodedString = decoder.decode(data);
                resolve(decodedString);
            }
        });
    });
}

async function readKdColor(path: string): Promise<THREE.Color> {
    const mtlStr = await readFile(path);
    const lines = mtlStr.split("\n");

    for (const line of lines) {
        const parts = line.trim().split(/\s+/);

        if (parts[0] === "Kd") {
            const r = parseFloat(parts[1]);
            const g = parseFloat(parts[2]);
            const b = parseFloat(parts[3]);

            return new THREE.Color(r, g, b);
        }
    }

    return new THREE.Color(1, 1, 1);
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(
        640,
        480,
        new THREE.Vector3(0, 0, 3)
    );

    document.body.appendChild(viewport);
}
