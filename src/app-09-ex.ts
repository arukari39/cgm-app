//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private light!: THREE.Light;
    private cloud!:THREE.Points;
    private cloud2!:THREE.Points;
    private cloud3!:THREE.Points;
    private particleVelocity!: THREE.Vector3[];

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

        const createParticles = () => {
     //ジオメトリの作成
     const geometry = new THREE.BufferGeometry();
     const geometry2 = new THREE.BufferGeometry();
     const geometry3= new THREE.BufferGeometry();

     //マテリアルの作成

     const textureLoader = new THREE.TextureLoader();
     const texture = textureLoader.load('./src/raindrop.png'); 
     const texture2 = textureLoader.load('./src/green.png'); 
     const texture3 = textureLoader.load('./src/star.png'); 

     const material = new THREE.PointsMaterial({ size: 1, map: texture, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 }) ;
     const material2 = new THREE.PointsMaterial({ size: 1, map: texture2, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 }) ;
     const material3 = new THREE.PointsMaterial({ size: 1, map: texture3, blending: THREE.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 }) ;
     //particleの作成
     this.particleVelocity = [];

     const particleNum = 10000; // パーティクルの数
     const positions = new Float32Array(particleNum * 3);
     const positions2 = new Float32Array(particleNum * 3);
     const positions3 = new Float32Array(particleNum * 3);
     let   particleIndex = 0;
     for (let i = 0; i < particleNum; i++){
        positions[particleIndex++] = 100*Math.random()-50; // x座標
        positions[particleIndex++] = 10*Math.random()+50; // y座標
        positions[particleIndex++] = 100*Math.random()-50; // z座標


        this.particleVelocity.push(new THREE.Vector3( 0, 30*-Math.random()*(10-6), 0));
     
     }
     particleIndex = 0;
     for (let i = 0; i < particleNum; i++){
        positions2[particleIndex++] = 100*Math.random()-50; // x座標
        positions2[particleIndex++] = 10*Math.random()+50; // y座標
        positions2[particleIndex++] = 100*Math.random()-50; // z座標


        this.particleVelocity.push(new THREE.Vector3( 0, 30*-Math.random()*(10-6), 0));
     
     }
     particleIndex = 0;
     for (let i = 0; i < particleNum; i++){
        positions3[particleIndex++] = 100*Math.random()-50; // x座標
        positions3[particleIndex++] = 10*Math.random()+50; // y座標
        positions3[particleIndex++] = 100*Math.random()-50; // z座標


        this.particleVelocity.push(new THREE.Vector3( 0, 30*-Math.random()*(10-6), 0));
     
     }
     geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
     geometry2.setAttribute('position',new THREE.BufferAttribute(positions2,3));
     geometry3.setAttribute('position',new THREE.BufferAttribute(positions3,3));

     //THREE.Pointsの作成
     this.cloud = new THREE.Points(geometry, material);
     this.cloud2 = new THREE.Points(geometry2, material2);
     this.cloud3 = new THREE.Points(geometry3, material3);
     

     //シーンへの追加
     this.scene.add(this.cloud);
     this.scene.add(this.cloud2);
     this.scene.add(this.cloud3);

}
createParticles();
        
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
            

            const geom = this.cloud.geometry as THREE.BufferGeometry;
            const positions = geom.getAttribute('position'); // 座標データ
            const geom2 = this.cloud2.geometry as THREE.BufferGeometry;
            const positions2 = geom2.getAttribute('position'); // 座標データ
            const geom3 = this.cloud3.geometry as THREE.BufferGeometry;
            const positions3 = geom3.getAttribute('position'); // 座標データ

            for (let y = 0; y < positions.count; y++){
            positions.setY(y, positions.getY(y) + this.particleVelocity[y].y* deltaTime);
            if(positions.getY(y)<-50){
                positions.setY(y,50)
            }
            }
            for (let y = 0; y < positions2.count; y++){
            positions2.setY(y, positions2.getY(y) + this.particleVelocity[y].y* deltaTime);
            if(positions2.getY(y)<-50){
                positions2.setY(y,50)
            }
            }
            for (let y = 0; y < positions3.count; y++){
            positions3.setY(y, positions3.getY(y) + this.particleVelocity[y].y* deltaTime);
            if(positions3.getY(y)<-50){
                positions3.setY(y,50)
            }
            }




            positions.needsUpdate = true;
            positions2.needsUpdate = true;
            positions3.needsUpdate = true;

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 50));
    document.body.appendChild(viewport);
}
