import * as THREE from "three";
import pkg from "@tonejs/midi";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const { Midi } = pkg;

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private geometry!: THREE.BufferGeometry;
    private material!: THREE.Material;
    private cube!: THREE.Mesh;
    private light!: THREE.Light;


    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(-40, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.scene = new THREE.Scene();
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (_time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private notesObjects: {
        mesh: THREE.Mesh,
        start: number,
        end: number
        particle: boolean
    }[] = [];

    private particles: {
        cloud: THREE.Points;
        velocity: THREE.Vector3[];
        life: number;
    }[] = [];

    // シーンの作成(全体で1回)
    private createScene = async () => {
        const response = await fetch("./introMIDI.mid");
        const arrayBuffer = await response.arrayBuffer();
        const midi = new Midi(arrayBuffer);

        const colors = [
            0xff5555, // 赤
            0x55ff55, // 緑
            0x5555ff, // 青
            0xffff55, // 黄
            0xff55ff, // 紫
            0x55ffff, // 水色
            0xff8800, // オレンジ
            0xffffff, // 白
        ];

        this.scene = new THREE.Scene();

        for (let i = 0; i < midi.tracks.length; i++) {
            const track = midi.tracks[i];
            for (let j = 0; j < track.notes.length; j++) {
                const note = track.notes[j];
                this.geometry = new THREE.BoxGeometry(1, 1, 1);
                this.material = new THREE.MeshStandardMaterial({
                    color: colors[i % colors.length],

                    emissive: colors[i % colors.length],
                    emissiveIntensity: 1.8,

                    roughness: 0.25,
                    metalness: 0.15,

                    transparent: true,
                    opacity: 0
                });
                this.cube = new THREE.Mesh(this.geometry, this.material);

                this.cube.position.x = note.time * 2;
                this.cube.position.y = (note.midi - 50) * 0.8;
                this.cube.position.z = i * 1.3;

                this.notesObjects.push({
                    mesh: this.cube,
                    start: note.time,
                    end: note.time + note.duration,
                    particle: false
                });
                this.scene.add(this.cube);

            }
        }

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x5555ff,

            emissive: 0x5555ff,
            emissiveIntensity: 2.5,

            transparent: true,
            opacity: 0.6,

            roughness: 0.2,
            metalness: 0.1
        });

        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 100, 70),
            wallMaterial
        );

        wall.position.set(0, 10, 4);

        this.scene.add(wall);

        const createParticles = (obj: { mesh: THREE.Mesh; start: number; end: number; particle: boolean; }) => {
            //ジオメトリの作成
            const geometry = new THREE.BufferGeometry();
            const velocity: THREE.Vector3[] = [];

            //マテリアルの作成

            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load('./melody.png');

            const material = new THREE.PointsMaterial({ size: 1, map: texture, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 });
            //particleの作成


            const particleNum = 10; // パーティクルの数
            const positions = new Float32Array(particleNum * 3);
            let particleIndex = 0;
            for (let i = 0; i < particleNum; i++) {
                positions[particleIndex++] = obj.mesh.position.x + (Math.random() - 0.5); // x座標
                positions[particleIndex++] = obj.mesh.position.y + (Math.random() - 0.5); // y座標
                positions[particleIndex++] = obj.mesh.position.z + (Math.random() - 0.5); // z座標


                velocity.push(new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8));
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const cloud = new THREE.Points(geometry, material);

            this.scene.add(cloud);

            this.particles.push({
                cloud: cloud,
                velocity: velocity,
                life: 0.4
            });

        }
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const startTime = performance.now();
        const timer = new THREE.Timer();
        let update: FrameRequestCallback = (_time) => {
            const currentTime = (performance.now() - startTime) / 1000;
            const speed = 1;
            timer.update(); //タイマーの更新
            const deltaTime = timer.getDelta();

            for (let i = 0; i < this.notesObjects.length; i++) {
                const obj = this.notesObjects[i];
                const material = obj.mesh.material as THREE.MeshPhongMaterial;

                obj.mesh.position.x = obj.start - currentTime * speed;

                if (currentTime >= obj.start) {

                    material.opacity = 1;

                    if (!obj.particle) {
                        obj.particle = true;
                        createParticles(obj);
                    }

                }
                else {
                    material.opacity = 0.1;
                }
            }

            for (let j = this.particles.length - 1; j >= 0; j--) {

                const particle = this.particles[j];

                particle.life -= deltaTime;

                const positions =
                    particle.cloud.geometry.getAttribute(
                        "position"
                    ) as THREE.BufferAttribute;

                for (let k = 0; k < positions.count; k++) {

                    //後で修正
                    positions.setXYZ(

                        k,

                        positions.getX(k) +
                        particle.velocity[k].x * deltaTime,

                        positions.getY(k) +
                        particle.velocity[k].y * deltaTime,

                        positions.getZ(k) +
                        particle.velocity[k].z * deltaTime

                    );

                }

                positions.needsUpdate = true;

                if (particle.life <= 0) {

                    this.scene.remove(particle.cloud);

                    particle.cloud.geometry.dispose();

                    (
                        particle.cloud.material as THREE.Material
                    ).dispose();

                    this.particles.splice(j, 1);

                }

            }

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-20, 20, 50));
    document.body.appendChild(viewport);
}
