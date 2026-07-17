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

        // メッシュの生成
        const geometry = new THREE.ConeGeometry(0.25, 1);
        const redMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
        const redCone = new THREE.Mesh(geometry, redMaterial);
        const greenCone = new THREE.Mesh(geometry, greenMaterial);
        const blueCone = new THREE.Mesh(geometry, blueMaterial);

        //モデルの座標移動
        redCone.translateX(0.5);
        redCone.rotateZ(-Math.PI / 2);
        greenCone.translateY(0.5);
        blueCone.translateZ(0.5);
        blueCone.rotateX(Math.PI / 2);

        //グループにして一つのオブジェクトとして扱う
        const obj: THREE.Group = new THREE.Group();
        obj.add(redCone);
        obj.add(greenCone);
        obj.add(blueCone);
        this.scene.add(obj);

        // グリッド表示
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        // 軸表示
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // 線形補間の関数
        // const lerp = (p0: THREE.Vector3, p1: THREE.Vector3, t: number): (THREE.Vector3) => {
        //     const result = new THREE.Vector3((1.0 - t) * p0.x + t * p1.x,
        //         (1.0 - t) * p0.y + t * p1.y,
        //         (1.0 - t) * p0.z + t * p1.z);
        //     //const result = p0.clone().multiplyScalar((1.0 - t)).add(p1.clone().multiplyScalar((t)));
        //     return result;
        // }

        //Bezier曲線の関数
        const bezier = (p0: THREE.Vector3, p1: THREE.Vector3,
            p2: THREE.Vector3, p3: THREE.Vector3, t: number): (THREE.Vector3) => {
            const result = p0.clone().multiplyScalar((1.0 - t) * (1.0 - t) * (1.0 - t))
                .add(p1.clone().multiplyScalar(3.0 * t * (1.0 - t) * (1.0 - t))
                    .add(p2.clone().multiplyScalar((3.0 * t * t) * (1.0 - t))
                        .add(p3.clone().multiplyScalar(t * t * t)))) //Bezier曲線を実装する
            return result;
        }

        // const hermite = (p0: THREE.Vector3, v0: THREE.Vector3,
        //     p1: THREE.Vector3, v1: THREE.Vector3, t: number): (THREE.Vector3) => {
        //     const result = p0.clone().multiplyScalar((2 * t + 1) * (1 - t) * (1 - t))
        //         .add(v0.clone().multiplyScalar(t * (1 - t) * (1 - t))
        //             .add(p1.clone().multiplyScalar(t * t * (3 - 2 * t)))
        //             .sub(v1.clone().multiplyScalar(t * t * (1 - t))))//エルミート曲線を実装する
        //     return result;
        // }

        //ライトの設定()
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);


        const points: THREE.Vector3[] = []
        points.push(new THREE.Vector3(-4, 0, 4));
        points.push(new THREE.Vector3(4, 0, 4));
        points.push(new THREE.Vector3(5, 0, 4));
        points.push(new THREE.Vector3(5, 0, 0));

        const table: { t: number; length: number }[] = [];
        const sampleCount = 10000;

        let totalLength = 0;
        let prev = bezier(points[0], points[1], points[2], points[3], 0);

        table.push({ t: 0, length: 0 });

        for (let i = 1; i <= sampleCount; i++) {
            const t = i / sampleCount;
            const cur = bezier(points[0], points[1], points[2], points[3], t);

            totalLength += cur.distanceTo(prev);
            table.push({ t, length: totalLength });

            prev = cur;
        }


        const getTByDistance = (targetDistance: number): number => {
            for (let i = 1; i < table.length; i++) {
                if (table[i].length >= targetDistance) {
                    return table[i].t;
                }
            }

            return 1.0;
        };

        const timer = new THREE.Timer();

        let distance = 0;
        const speed = 10.0;

        const update: FrameRequestCallback = () => {
            timer.update();

            distance += speed * timer.getDelta();

            if (distance > totalLength) {
                distance -= totalLength;
            }

            const t = getTByDistance(distance);

            const pos = bezier(points[0], points[1], points[2], points[3], t);
            obj.position.copy(pos);

            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 7, 5));
    document.body.appendChild(viewport);
}
