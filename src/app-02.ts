//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSContainer {
    private scene!: THREE.Scene;
    private geometry!: THREE.BufferGeometry;
    private material!: THREE.Material;
    private cube!: THREE.Mesh;
    private core!: THREE.Mesh;
    private light!: THREE.Light;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));

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

        //this.geometry = new THREE.BoxGeometry(2, 2, 2);
        //this.material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
        //this.cube = new THREE.Mesh(this.geometry, this.material);
        //this.scene.add(this.cube);

        const addtry1 =() => {
    //GeometryとMaterialを作成する
    const tryGeometry: THREE.BufferGeometry = new THREE.TetrahedronGeometry(0.5);
    const tryMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color:0x00ffff });

    //オブジェクトを生成する
    const tryAdd: THREE.Mesh = new THREE.Mesh(tryGeometry, tryMaterial);
    //オブジェクトのプロパティを設定する
    tryAdd.name = "try-" + this.scene.children.length;
 
    //オブジェクトを移動する
    tryAdd.position.x = Math.round((Math.random() * 5))+0.5 ;
    tryAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    tryAdd.position.z = Math.round((Math.random() * 5))+0.5 ;
    //オブジェクトを回転させる
    tryAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    tryAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(tryAdd);
 }
 const addtry2 =() => {
    //GeometryとMaterialを作成する
    const tryGeometry: THREE.BufferGeometry = new THREE.TetrahedronGeometry(0.5);
    const tryMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0x00ffff });

    //オブジェクトを生成する
    const tryAdd: THREE.Mesh = new THREE.Mesh(tryGeometry, tryMaterial);
    //オブジェクトのプロパティを設定する
    tryAdd.name = "try-" + this.scene.children.length;
 
    //オブジェクトを移動する
    tryAdd.position.x = Math.round((Math.random() * 5)) -2;
    tryAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    tryAdd.position.z = Math.round((Math.random() * -5)) - 2.5;
    //オブジェクトを回転させる
    tryAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    tryAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(tryAdd);
 }

 const addtor1 =() => {
    //GeometryとMaterialを作成する
    const torGeometry: THREE.BufferGeometry = new THREE.TorusGeometry( 0.5, 0.3, 2, Math.round((Math.random() * 5)) );;
    const torMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0xff1493 });

    //オブジェクトを生成する
    const torAdd: THREE.Mesh = new THREE.Mesh(torGeometry, torMaterial);
    //オブジェクトのプロパティを設定する
    torAdd.name = "tor-" + this.scene.children.length;
 
    //オブジェクトを移動する
    torAdd.position.x = Math.round((Math.random() * 5)) +0.5;
    torAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    torAdd.position.z = Math.round((Math.random() * 5)) +0.5;
    //オブジェクトを回転させる
    torAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    torAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(torAdd);
 }
 
 const addtor2 =() => {
    //GeometryとMaterialを作成する
    const torGeometry: THREE.BufferGeometry = new THREE.TorusGeometry( 0.5, 0.3, 2, Math.round((Math.random() * 5)) );;
    const torMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0xff1493 });

    //オブジェクトを生成する
    const torAdd: THREE.Mesh = new THREE.Mesh(torGeometry, torMaterial);
    //オブジェクトのプロパティを設定する
    torAdd.name = "tor-" + this.scene.children.length;
 
    //オブジェクトを移動する
    torAdd.position.x = Math.round((Math.random() * 5)) -2;
    torAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    torAdd.position.z = Math.round((Math.random() * -5)) - 2.5;
    //オブジェクトを回転させる
    torAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    torAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(torAdd);
 }

 const addoct1 =() => {
    //GeometryとMaterialを作成する
    const octGeometry: THREE.BufferGeometry = new THREE.OctahedronGeometry(0.5,Math.round((Math.random() * 2)));
    const octMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0x00bfff });

    //オブジェクトを生成する
    const octAdd: THREE.Mesh = new THREE.Mesh(octGeometry, octMaterial);
    //オブジェクトのプロパティを設定する
    octAdd.name = "oct-" + this.scene.children.length;
 
    //オブジェクトを移動する
    octAdd.position.x = Math.round((Math.random() * 5))+0.5 ;
    octAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    octAdd.position.z = Math.round((Math.random() * 5)) +0.5;
    //オブジェクトを回転させる
    octAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    octAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(octAdd);
 }
 
 const addoct2 =() => {
    //GeometryとMaterialを作成する
    const octGeometry: THREE.BufferGeometry = new THREE.OctahedronGeometry(0.5,Math.round((Math.random() * 2)));
    const octMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0x00bfff });

    //オブジェクトを生成する
    const octAdd: THREE.Mesh = new THREE.Mesh(octGeometry, octMaterial);
    //オブジェクトのプロパティを設定する
    octAdd.name = "oct-" + this.scene.children.length;
 
    //オブジェクトを移動する
    octAdd.position.x = Math.round((Math.random() * 5)) -2;
    octAdd.position.y = Math.round((Math.random() * 4)) -1.5;
    octAdd.position.z = Math.round((Math.random() * -5)) - 2.5;
    //オブジェクトを回転させる
    octAdd.rotation.x = THREE.MathUtils.degToRad(Math.random() * 45);
    octAdd.rotation.y = THREE.MathUtils.degToRad(Math.random() * 45);
    //シーンに追加する
    this.scene.add(octAdd);
 }

 const addRandomObject = () =>{
    //０～3の乱数を発生させる。
    const randval = Math.round(Math.random()*6)
    //
    switch(randval){
         case 0:
         addtry1();
         break;
         case 1:
         addtry2();
         break;
         case 2:
         addtor1();
         break;
         case 3:
         addtor2();
         break;
         case 4:
         addoct1();
         break;
         case 5:
         addoct2();
         break;
    }
    
}

 for (let i: number = 0; i < 90; i++) {
   addRandomObject();
 }
 //以下中央のオブジェクト作成のためのプログラム
   const addObject = () =>{
    //Geometryの生成
    const addObjectGeometry: THREE.BufferGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    //Materialの生成
    const meshMaterial: THREE.Material = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
    //オブジェクトの生成
    const addObject: THREE.Mesh = new THREE.Mesh(addObjectGeometry, meshMaterial);
    //オブジェクトを移動する
    addObject.position.y =  -3;  
    //オブジェクトを回転させる
    addObject.rotation.x =  THREE.MathUtils.degToRad(90);
    //オブジェクトのシーンへの追加
    this.scene.add(addObject);
}
   addObject();

const addstic =() => {
    //GeometryとMaterialを作成する
    const sticGeometry: THREE.BufferGeometry = new THREE.CapsuleGeometry( 0.1, 2.5, 1, 200, 1 );
    const sticMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0x00bfff });

    //オブジェクトを生成する
    const sticAdd: THREE.Mesh = new THREE.Mesh(sticGeometry, sticMaterial);
    //オブジェクトのプロパティを設定する
    sticAdd.name = "stic-" + this.scene.children.length;
    //オブジェクトの位置調整
    sticAdd.position.y = -1;   
    //シーンに追加する
    this.scene.add(sticAdd);
 }
 addstic();
 const addstic2 =() => {
    //GeometryとMaterialを作成する
    const sticGeometry: THREE.BufferGeometry = new THREE.TorusGeometry(0.5, 0.1, 2,100,2);
    const sticMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0xc71585 });

    //オブジェクトを生成する
    const sticAdd: THREE.Mesh = new THREE.Mesh(sticGeometry, sticMaterial);
    //オブジェクトのプロパティを設定する
    sticAdd.name = "oct-" + this.scene.children.length;
    //オブジェクトの位置調整
    sticAdd.rotation.z = THREE.MathUtils.degToRad(150 );
    sticAdd.rotation.y = THREE.MathUtils.degToRad(130 );
    //シーンに追加する
    this.scene.add(sticAdd);
 }
 addstic2();
 const addstic3 =() => {
    //GeometryとMaterialを作成する
    const sticGeometry: THREE.BufferGeometry = new THREE.TorusGeometry(0.5, 0.1, 2,100,2);
    const sticMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0xc71585 });

    //オブジェクトを生成する
    const sticAdd: THREE.Mesh = new THREE.Mesh(sticGeometry, sticMaterial);
    //オブジェクトのプロパティを設定する
    sticAdd.name = "oct-" + this.scene.children.length;
    //オブジェクトの位置調整
    sticAdd.rotation.z = THREE.MathUtils.degToRad(150 );
    sticAdd.rotation.y = THREE.MathUtils.degToRad(330 );
    //シーンに追加する
    this.scene.add(sticAdd);
 }
 addstic3();



        this.geometry = new THREE.OctahedronGeometry(0.35,1);
        this.material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        this.core = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.core);
 

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {
            this.cube.rotateX(0.5);
            this.core.rotateX(1);

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}
console.log("Hello"); //ログの吐き出し
window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
