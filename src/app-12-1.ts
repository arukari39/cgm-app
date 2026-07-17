//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from 'cannon-es';

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

        const cubeMeshes: THREE.Mesh[] = [];
        const cubeBodies: CANNON.Body[] = [];
        const dominonum = 30;
        const radius = 5;
        


        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        world.defaultContactMaterial.friction = 0.05;
        world.defaultContactMaterial.restitution = 0.8;


       for(let i = 0; i < dominonum;i++){
        const geometry = new THREE.BoxGeometry(0.7, 1.5, 0.2);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        cubeMeshes.push(new THREE.Mesh(geometry, material));
        cubeMeshes[i].position.y = 0.7;
        const circle = (i / dominonum) * Math.PI * 2;

        cubeMeshes[i].position.set(radius * Math.cos(circle),0.7,radius * Math.sin(circle));
        cubeMeshes[i].rotateY(radius * Math.sin(circle));
        cubeMeshes[i].lookAt(radius * Math.cos(circle + 0.1),0.7,radius * Math.sin(circle + 0.1));
        
        if(i== 0){
          cubeMeshes[i].rotateX(-0.7);  
        }
        this.scene.add(cubeMeshes[i]);
       }

       for(let i = 0; i < dominonum;i++){
        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.75, 0.1));
        cubeBodies.push(new CANNON.Body({ mass: 1 }));
        cubeBodies[i].addShape(cubeShape);
        cubeBodies[i].position.set(cubeMeshes[i].position.x, cubeMeshes[i].position.y, cubeMeshes[i].position.z);
        cubeBodies[i].quaternion.set(cubeMeshes[i].quaternion.x, cubeMeshes[i].quaternion.y, cubeMeshes[i].quaternion.z, cubeMeshes[i].quaternion.w);
        world.addBody(cubeBodies[i]);
       }

         const phongMaterial = new THREE.MeshPhongMaterial();
         const planeGeometry = new THREE.PlaneGeometry(25, 25);
         const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
         planeMesh.material.side = THREE.DoubleSide; // 両面
         planeMesh.rotateX(-Math.PI / 2);

        this.scene.add(planeMesh);

        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({ mass: 0 })
        planeBody.addShape(planeShape)
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);

        world.addBody(planeBody)


        // グリッド表示
        const gridHelper = new THREE.GridHelper( 10,);
        this.scene.add( gridHelper );  

        // 軸表示
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
        
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {
            world.fixedStep();
            for(let i = 0; i < dominonum;i++){
            cubeMeshes[i].position.set(cubeBodies[i].position.x, cubeBodies[i].position.y, cubeBodies[i].position.z);
            cubeMeshes[i].quaternion.set(cubeBodies[i].quaternion.x, cubeBodies[i].quaternion.y, cubeBodies[i].quaternion.z, cubeBodies[i].quaternion.w);
            }
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}
