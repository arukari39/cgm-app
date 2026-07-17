//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


class ThreeJSContainer {
    private scene!: THREE.Scene;
    private light!: THREE.Light;
    geometry: THREE.BoxGeometry | undefined;
    material: THREE.MeshLambertMaterial | undefined;
    cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap> | undefined;

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
        const points:THREE.Vector2[] = [];
        const points2:THREE.Vector2[] = [];

    const pointNum = 10;
 for(let i = 0; i < pointNum; ++i) {

    const x =  Math.exp(( i / (pointNum - 1))*1.4) * 0.8;
    const y = -3 + ( i / (pointNum - 1)) * 5.0;
    points.push(new THREE.Vector2(x, y));
 }

  
 for(let i = 0; i < pointNum; ++i) {
     points2.push(new THREE.Vector2(Math.cos(Math.PI * i / (pointNum - 1) - Math.PI / 2),
                                   -3+Math.sin(Math.PI * i / (pointNum - 1) - Math.PI / 2)));
 }

 const drawShape = ()=> {
     // THREE.Shapeを作成
     const shape = new THREE.Shape();
 
     // 形状を定義 
     shape.moveTo(0.5, 0.5);
     shape.lineTo(0.5, -0.5);
     shape.lineTo(-0.5, -0.5);
      shape.lineTo(-0.5, 0.5);

     return shape;
}

 const extrudeSettings = {
     steps: 2,
     depth: 12,
     bevelEnabled: false,
     bevelThickness: 4,
     bevelSize: 2,
     bevelSegments: 3
 };

const shapeGeometry = new THREE.ExtrudeGeometry(drawShape(), extrudeSettings)
const lineMaterial  = new THREE.LineBasicMaterial({color: 0xfff000, transparent:true, opacity:0.5}) 
const meshMaterial = new THREE.MeshPhongMaterial({color:0x0ff0f0, side:THREE.DoubleSide,flatShading:true});




const num = 8;
const radius = 1;

for (let i = 0; i < num; i++) {

    const group = new THREE.Group();

    group.add(new THREE.Mesh(shapeGeometry, meshMaterial));
    group.add(new THREE.LineSegments(shapeGeometry, lineMaterial));

    const theta = i / num * Math.PI * 2;

group.position.set(radius * Math.cos(theta),radius * Math.sin(theta), i * 0.5);

    this.scene.add(group);
}

this.geometry = new THREE.BoxGeometry(0.5, 5, 0.5);
        this.material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.position.set(0,-2,-3 );
        this.scene.add(this.cube);


 

const latheGeometry = new THREE.LatheGeometry(points);
latheGeometry.rotateX(Math.PI/2);
const latheMaterial = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
 const latheMesh = new THREE.Mesh(latheGeometry, latheMaterial);

 const latheGeometry2 = new THREE.LatheGeometry(points2);
latheGeometry2.rotateX(Math.PI/2);
const latheMaterial2 = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
 const latheMesh2 = new THREE.Mesh(latheGeometry2, latheMaterial2);

 
 
 this.scene.add(latheMesh);
 this.scene.add(latheMesh2);

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

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(7, 0, -3));
    document.body.appendChild(viewport);
}
