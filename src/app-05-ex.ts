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
    const textureFileName = await readmtlKd(mtlPath);

    const vertices: number[] = [];
    const uvs: number[] = [];

    const vertexIndices: number[] = [];
    const uvIndices: number[] = [];

    const meshLines = meshStr.split("\n");

    for (let i = 0; i < meshLines.length; ++i) {
        const meshLine = meshLines[i].trim();
        const meshSpaceSplitArray = meshLine.split(/\s+/);

        const meshType = meshSpaceSplitArray[0];

        if (meshType === "v") {
            vertices.push(
                parseFloat(meshSpaceSplitArray[1]),
                parseFloat(meshSpaceSplitArray[2]),
                parseFloat(meshSpaceSplitArray[3])
            );
        } else if (meshType === "vt") {
            uvs.push(
                parseFloat(meshSpaceSplitArray[1]),
                parseFloat(meshSpaceSplitArray[2])
            );
        } else if (meshType === "f") {
            const f1 = meshSpaceSplitArray[1].split("/");
            const f2 = meshSpaceSplitArray[2].split("/");
            const f3 = meshSpaceSplitArray[3].split("/");

            vertexIndices.push(
                parseInt(f1[0]) - 1,
                parseInt(f2[0]) - 1,
                parseInt(f3[0]) - 1
            );

            uvIndices.push(
                parseInt(f1[1]) - 1,
                parseInt(f2[1]) - 1,
                parseInt(f3[1]) - 1
            );
        }
    }

    const finalVertices: number[] = [];
    const finalUvs: number[] = [];

    for (let i = 0; i < vertexIndices.length; i++) {
        const vertexIndex = vertexIndices[i];
        const uvIndex = uvIndices[i];

        finalVertices.push(
            vertices[vertexIndex * 3],
            vertices[vertexIndex * 3 + 1],
            vertices[vertexIndex * 3 + 2]
        );

        finalUvs.push(
            uvs[uvIndex * 2],
            uvs[uvIndex * 2 + 1]
        );
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(finalVertices), 3)
    );

    geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(finalUvs), 2)
    );

    geometry.computeVertexNormals();

    let material: THREE.Material;

    if (textureFileName !== null) {
        const texture = new THREE.TextureLoader().load("./src/" + textureFileName);

        material = new THREE.MeshBasicMaterial({
            map: texture
        });
    } else {
        material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
    }

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
};

        addSceneFromObjFile("./src/dice.obj", "./src/dice.mtl");

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

async function readmtlKd(path: string): Promise<string | null> {
    const mtlStr = await readFile(path);
    const lines = mtlStr.split("\n");

    for (const line of lines) {
        const parts = line.trim().split(/\s+/);

        if (parts[0] === "map_Kd") {
            return parts[1];
        }
    }

    return null;
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
