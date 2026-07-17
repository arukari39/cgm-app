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
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0)});
        world.defaultContactMaterial.restitution = 0.8;
world.defaultContactMaterial.friction = 0.03;

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

const carBody = new CANNON.Body({ mass: 5 });
const carBodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2));
carBody.addShape(carBodyShape);
carBody.position.y = 1;
 const vehicle = new CANNON.RigidVehicle({ chassisBody: carBody });

const wheelShape = new CANNON.Sphere(1);

 const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

this.scene.add(boxMesh);

const frontLeftWheelBody = new CANNON.Body({ mass: 1 });
frontLeftWheelBody.addShape(wheelShape);
frontLeftWheelBody.angularDamping = 0.4;

const frontrightWheelBody = new CANNON.Body({ mass: 1 });
frontrightWheelBody.addShape(wheelShape);
frontrightWheelBody.angularDamping = 0.4;

const reerLeftWheelBody = new CANNON.Body({ mass: 1 });
reerLeftWheelBody.addShape(wheelShape);
reerLeftWheelBody.angularDamping = 0.4;

const reerrightWheelBody = new CANNON.Body({ mass: 1 });
reerrightWheelBody.addShape(wheelShape);
reerrightWheelBody.angularDamping = 0.4;


vehicle.addWheel({
    body: frontLeftWheelBody,
    position: new CANNON.Vec3(-2, 0, 2.5)
});

vehicle.addWheel({
    body: frontrightWheelBody,
    position: new CANNON.Vec3(2, 0, 2.5)
});

vehicle.addWheel({
    body: reerLeftWheelBody,
    position: new CANNON.Vec3(-2, 0, -2.5)
});

vehicle.addWheel({
    body: reerrightWheelBody,
    position: new CANNON.Vec3(2, 0, -2.5)
});


const wheelGeometry = new THREE.SphereGeometry(1);
const wheelMaterial = new THREE.MeshNormalMaterial();

const frontLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
this.scene.add(frontLeftMesh);
const frontrightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
this.scene.add(frontrightMesh);
const reerLeftMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
this.scene.add(reerLeftMesh);
const reerrightMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
this.scene.add(reerrightMesh);

vehicle.addToWorld(world);


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

        let r0 = 0;
        let r1 = 0;
        let a = 0;
        let b = 0;
        
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {

            

            world.fixedStep();

            boxMesh.position.set(carBody.position.x, carBody.position.y, carBody.position.z);
            boxMesh.quaternion.set(carBody.quaternion.x, carBody.quaternion.y, carBody.quaternion.z, carBody.quaternion.w);

            frontLeftMesh.position.set(frontLeftWheelBody.position.x, frontLeftWheelBody.position.y, frontLeftWheelBody.position.z);
            frontLeftMesh.quaternion.set(frontLeftWheelBody.quaternion.x, frontLeftWheelBody.quaternion.y, frontLeftWheelBody.quaternion.z, frontLeftWheelBody.quaternion.w);

            frontrightMesh.position.set(frontrightWheelBody.position.x, frontrightWheelBody.position.y, frontrightWheelBody.position.z);
            frontrightMesh.quaternion.set(frontrightWheelBody.quaternion.x, frontrightWheelBody.quaternion.y, frontrightWheelBody.quaternion.z, frontrightWheelBody.quaternion.w);

            reerLeftMesh.position.set(reerLeftWheelBody.position.x, reerLeftWheelBody.position.y, reerLeftWheelBody.position.z);
            reerLeftMesh.quaternion.set(reerLeftWheelBody.quaternion.x, reerLeftWheelBody.quaternion.y, reerLeftWheelBody.quaternion.z, reerLeftWheelBody.quaternion.w);

            reerrightMesh.position.set(reerrightWheelBody.position.x, reerrightWheelBody.position.y, reerrightWheelBody.position.z);
            reerrightMesh.quaternion.set(reerrightWheelBody.quaternion.x, reerrightWheelBody.quaternion.y, reerrightWheelBody.quaternion.z, reerrightWheelBody.quaternion.w);

            vehicle.setWheelForce(a, 0);
            vehicle.setWheelForce(a, 1);
            vehicle.setWheelForce(b, 2);
            vehicle.setWheelForce(b, 3);

            vehicle.setSteeringValue(THREE.MathUtils.degToRad(r0), 0);
            vehicle.setSteeringValue(THREE.MathUtils.degToRad(r1), 1);

            document.addEventListener("keydown", (event) => {

    switch(event.key){

        case "ArrowUp":
            a = 10;
            break;

        case "ArrowDown":
            b = -10;
            break;

        case "ArrowLeft":
            r0 = 30;
            r1 = 30;
            break;

        case "ArrowRight":
            r0 = -200;
            r1 = -200;
            break;
    }

});

 document.addEventListener("keyup", (event) => {

    switch(event.key){

        case "ArrowUp":
            a = 0;
            break;

        case "ArrowDown":
            b = 0;
            break;

        case "ArrowLeft":
            r0 = 0;
            r1 = 0;
            break;

        case "ArrowRight":
            r0 = 0;
            r1 = 0;
            break;
    }

});

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(10, 10, 10));
    document.body.appendChild(viewport);
}
