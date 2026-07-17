//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui';
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { createNoise3D } from 'simplex-noise';

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

        const gui = new GUI(); // GUI用のインスタンスの生成
        const guiObj = { shape: 'wave'}
        gui.add( guiObj, 'shape', [ 'wave','klein' ,'Perlin'] )
         
             

        this.scene = new THREE.Scene();

        //波打つ平面の設定
        const wave = (u:number, v:number, target:THREE.Vector3) =>{
          const r = 10;
          const x = u * r - r/2;
          const z = v * r - r/2;
          const radius = Math.sqrt(x * x + z * z);
          const y = Math.sin(radius * 3); 
          target.set(x, y, z);
        }

         //クラインの壺の設定
        const klein = (u:number, v:number, target:THREE.Vector3) =>{
          u = u * Math.PI * 2;
          v = v * Math.PI * 2; 
          const r = 4- 2*Math.cos(u);
          let x = 0;
          if(u < Math.PI && u >= 0){
           x = 6*Math.cos(u)*(1+Math.sin(u))+r*Math.cos(u)*Math.cos(v);
          }
          if(u <= Math.PI*2 && u >= Math.PI){
            x =6*Math.cos(u)*(1+Math.sin(u))+r*Math.cos(v+Math.PI);
          }
          let y = 0;
          if(u < Math.PI && u >= 0){
            y =16*Math.sin(u)+r*Math.sin(u)*Math.cos(v);
          }
          if(u <= Math.PI*2 && u >= Math.PI){
            y = 16*Math.sin(u);
          }
          const z = r*Math.sin(v);
          target.set(x, y, z);
        }
        //ノイズによるなだらかな地形の設定
        const noise3D = createNoise3D();

        const Perlin = (u:number, v:number, target:THREE.Vector3) =>{
         
        const r = 30;
        const x = u * r - r/2;
        
        const z = v * r - r/2;
        const value3d = noise3D(x * 0.08, z * 0.08, 0); 
        const y = value3d * 3.0;
        target.set(x, y, z);
        }

                let paramGeometry =new ParametricGeometry(wave, 30, 30);;
                let paramMaterial = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
                let lineMaterial  = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true, opacity:0.5});
                let group = new THREE.Group();
                group.add(new THREE.Mesh(paramGeometry,paramMaterial));
                group.add(new THREE.LineSegments(paramGeometry,lineMaterial));
                this.scene.add(group);
                let paramGeometry2 = new ParametricGeometry(klein, 30, 30);
                let paramMaterial2 = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
                let lineMaterial2  = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true, opacity:0.5});
                let group2 = new THREE.Group();
                group2.add(new THREE.Mesh(paramGeometry2,paramMaterial2));
                group2.add(new THREE.LineSegments(paramGeometry2,lineMaterial2));
                this.scene.add(group2);
                let paramGeometry3 = new ParametricGeometry(Perlin, 50, 50);
                let paramMaterial3 = new THREE.MeshPhongMaterial({color:0x00ffff, side:THREE.DoubleSide,flatShading:true});
                let lineMaterial3  = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true, opacity:0.5});
                let group3 = new THREE.Group();
                group3.add(new THREE.Mesh(paramGeometry3,paramMaterial3));
                group3.add(new THREE.LineSegments(paramGeometry3,lineMaterial3));
                this.scene.add(group3);



        

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {
          //表示切替設定
            

            if(guiObj.shape == 'wave'){
                group.visible = true;
                group2.visible = false;
                group3.visible = false;
                
            }else if(guiObj.shape == 'klein'){
                 group.visible = false;
                 group2.visible = true;
                 group3.visible = false;
                
                
            }else if(guiObj.shape == 'Perlin'){
                 group.visible = false;
                 group2.visible = false;
                 group3.visible = true;
                
                
            }

            
             

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);

         
         
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-10, 10, 10));
    document.body.appendChild(viewport);
}
