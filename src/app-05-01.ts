//24FI095 樋口喬広 
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private light!: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (_time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();
     const vertices = new Float32Array([
        -0.5, -0.5,  0.5, // 0
         0.5, -0.5,  0.5, // 1
         0.5,  0.5,  0.5, // 2
        -0.5,  0.5,  0.5, // 3

        -0.5, -0.5, -0.5, // 4
         0.5, -0.5, -0.5, // 5
         0.5,  0.5, -0.5, // 6
        -0.5,  0.5, -0.5, // 7
    ]);

 const colors = new Float32Array([
    1, 1, 0, // 0 黄
    1, 0, 0, // 1 赤
    1, 0, 1, // 2 マゼンタ
    0, 0, 0, // 3 黒

    0, 1, 0, // 4 緑
    1, 1, 1, // 5 白
    0, 1, 1, // 6 シアン
    0, 0, 1, // 7 青
]);


    const indices = [
        // 前面
        0, 1, 2,
        0, 2, 3,

        // 右面
        1, 5, 6,
        1, 6, 2,

        // 背面
        5, 4, 7,
        5, 7, 6,

        // 左面
        4, 0, 3,
        4, 3, 7,

        // 上面
        3, 2, 6,
        3, 6, 7,

        // 下面
        4, 5, 1,
        4, 1, 0,
    ];

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}


window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(1.8, 1.5, 2.7));
    document.body.appendChild(viewport);
}
