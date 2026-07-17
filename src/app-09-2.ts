//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private light!: THREE.Light;
    private cloud!:THREE.Points;
    private cloud2!:THREE.Points;
    private cloud3!:THREE.Points;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000)); 
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
        const createPoints = (geom: THREE.BufferGeometry)=> {
    geom.deleteAttribute('uv');
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: generateSprite()
     });
     return new THREE.Points(geom, material);
     
}

const createPoints2 = (geom: THREE.BufferGeometry)=> {
    geom.deleteAttribute('uv');
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: generateSprite2()
     });
     return new THREE.Points(geom, material);
     
}

const createPoints3 = (geom: THREE.BufferGeometry)=> {
    geom.deleteAttribute('uv');
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: generateSprite3()
     });
     return new THREE.Points(geom, material);
     
}

const generateSprite = () =>{
    //新しいキャンバスの作成
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

     //円形のグラデーションの作成
     const context = canvas.getContext('2d')!;
     const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
     gradient.addColorStop(0, 'rgba(255,255,255,1)');
     gradient.addColorStop(0.2, 'rgba(0,0,255,1)');
     gradient.addColorStop(0.4, 'rgba(0, 0,64,1)');
     gradient.addColorStop(1, 'rgba(0,0,0,1)');
    
     context.fillStyle = gradient;
     context.fillRect(0, 0, canvas.width, canvas.height);
     //テクスチャの生成
     const texture = new THREE.Texture(canvas);
     texture.needsUpdate = true;
     return texture;
}

const generateSprite2 = () =>{
    //新しいキャンバスの作成
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

     //円形のグラデーションの作成
     const context = canvas.getContext('2d')!;
     const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
     gradient.addColorStop(0, 'rgb(253, 200, 200)');
     gradient.addColorStop(0.2, 'rgb(7, 173, 52)');
     gradient.addColorStop(0.4, 'rgb(1, 6, 6)');
     gradient.addColorStop(1, 'rgba(0,0,0,1)');
    
     context.fillStyle = gradient;
     context.fillRect(0, 0, canvas.width, canvas.height);
     //テクスチャの生成
     const texture = new THREE.Texture(canvas);
     texture.needsUpdate = true;
     return texture;
}

const generateSprite3 = () =>{
    //新しいキャンバスの作成
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

     //円形のグラデーションの作成
     const context = canvas.getContext('2d')!;
     const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
     gradient.addColorStop(0, 'rgba(255,255,255,1)');
     gradient.addColorStop(0.2, 'rgb(255, 0, 200)');
     gradient.addColorStop(0.4, 'rgba(0, 0,64,1)');
     gradient.addColorStop(1, 'rgba(0,0,0,1)');
    
     context.fillStyle = gradient;
     context.fillRect(0, 0, canvas.width, canvas.height);
     //テクスチャの生成
     const texture = new THREE.Texture(canvas);
     texture.needsUpdate = true;
     return texture;
}

this.cloud = createPoints(new THREE.TorusGeometry(5, 0.4, 30, 30));
this.scene.add(this.cloud);
this.cloud2 = createPoints2(new THREE.TorusGeometry(5, 0.4, 30, 30));
this.scene.add(this.cloud2);
this.cloud3 = createPoints3(new THREE.TorusGeometry(3, 0.4, 30, 30));
this.scene.add(this.cloud3);

        
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const timer = new THREE.Timer();
        const update: FrameRequestCallback = (_time) => {
            timer.update(); //タイマーの更新
            const deltaTime = timer.getDelta();
            this.cloud.rotation.z += deltaTime;
            this.cloud2.rotation.z -= deltaTime;
            this.cloud3.rotation.x += deltaTime * 4;
            this.cloud3.rotation.z += deltaTime * 4;
           
            



            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    document.body.appendChild(viewport);
}
