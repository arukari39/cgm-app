//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private group!: THREE.Group;
    private scene!: THREE.Scene;
    private plane!: THREE.Mesh;

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
        //const camera = new THREE.OrthographicCamera(width/-150.0, width/150.0, height/150.0, height/-150.0, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(1000, 1000, 2000));

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
        this.group = new THREE.Group();
        this.scene = new THREE.Scene();

        

        const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        const loader = new THREE.TextureLoader();
        const texture = loader.load("images/wamon.jpg")//画像の読み込み
          const matArray = [];
          //各面のマテリアル設定
         matArray.push(new THREE.MeshStandardMaterial({ metalness : 1,roughness:0,color: 0x009e60 }));
         matArray.push(new THREE.MeshBasicMaterial({ wireframe:true,color: 0x0051ba }));
         matArray.push(new THREE.MeshPhongMaterial({specular:new THREE.Color(0x55ff00), color: 0xffd500 }));
         matArray.push(new THREE.MeshBasicMaterial({color: 0xc41e3a}));
         matArray.push(new THREE.MeshBasicMaterial({ map: texture  }));//画像の貼り付け
         matArray.push(new THREE.MeshLambertMaterial({ color: 0xffffff }));
         
          

        // オブジェクトを3x3に並べて生成
        for (let x = 0; x < 3; x++) {
            for(let y = 0; y < 3;y++){
            for (let z = 0; z < 3; z++) {
                // メッシュの生成
                const mesh = new THREE.Mesh(geometry, matArray);
                mesh.castShadow = true;
                // メッシュの位置を設定
                mesh.position.set(x * 2 - 2, y*2-2, z * 2 - 2) ;
                // メッシュをシーンに追加
                this.group.add(mesh);
            }
        }
        }
        this.scene.add(this.group);
         

        // 平面の生成
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true; //影を受けるようにする
        this.plane.position.y = -5;
        this.plane.rotation.x = -Math.PI / 2;
        this.scene.add(this.plane);

        //ライトの設定
        const light = new THREE.DirectionalLight(0xffffff, 3.0);
        light.position.set(1, 1, 1);
        light.target = this.plane;
        light.castShadow = true;
        this.scene.add(light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {
             this.group.rotateX(0.01);
             this.group.rotateY(0.015);
             this.group.rotateZ(0.005);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
