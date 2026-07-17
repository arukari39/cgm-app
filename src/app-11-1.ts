//24FI095 樋口喬広
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as TWEEN from "@tweenjs/tween.js";

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

         const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 2.5, 0);
        this.scene.add(cube);

        const greenCubeGeometry = new THREE.BoxGeometry();
        const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const greenCube = new THREE.Mesh(greenCubeGeometry, greenMaterial);
        greenCube.position.set(0, -2.5, 0);
        this.scene.add(greenCube);

        // Tweenでコントロールする変数の定義
      const tweeninfo = {translateX: 0,translateY: 2.5};

       //  Tweenでパラメータの更新の際に呼び出される関数
      const updatetranslate =()=>{
      cube.position.x = tweeninfo.translateX;
      cube.position.y = tweeninfo.translateY;
      }


       // Tweenの作成
      
      const tween = new TWEEN.Tween(tweeninfo).delay(500).to({ translateX: 2.5,translateY: 0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatetranslate);
      const tween2 = new TWEEN.Tween(tweeninfo).delay(500).to({ translateX: 0,translateY: -2.5 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatetranslate);
      const tween3 = new TWEEN.Tween(tweeninfo).delay(500).to({ translateX: -2.5,translateY: 0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatetranslate);
      const tween4 = new TWEEN.Tween(tweeninfo).delay(500).to({ translateX: 0,translateY: 2.5 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatetranslate);
      

      let greenCubeTweeninfo = {translateX: 0,translateY: -2.5};
      let updateGreenCubetranslate =()=>{
       greenCube.position.x = greenCubeTweeninfo.translateX;
      greenCube.position.y = greenCubeTweeninfo.translateY;
       }

       const greenCubeTween = new TWEEN.Tween(greenCubeTweeninfo).delay(500).to({ translateX: -2.5,translateY: 0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubetranslate);
       const greenCubeTween2 = new TWEEN.Tween(greenCubeTweeninfo).delay(500).to({ translateX: 0,translateY: 2.5 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubetranslate);
       const greenCubeTween3 = new TWEEN.Tween(greenCubeTweeninfo).delay(500).to({ translateX: 2.5,translateY: 0 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubetranslate);
       const greenCubeTween4 = new TWEEN.Tween(greenCubeTweeninfo).delay(500).to({ translateX: 0,translateY: -2.5 }, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updateGreenCubetranslate);
       

  
     // グループの生成
      const group = new TWEEN.Group();
      group.add(tween);
      group.add(tween2);
      group.add(tween3);
      group.add(tween4);
      group.add(greenCubeTween);
      group.add(greenCubeTween2);
      group.add(greenCubeTween3);
      group.add(greenCubeTween4);

      // アニメーションの開始
      tween.start();
      greenCubeTween.start();


        
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        const update: FrameRequestCallback = (_time) => {

            requestAnimationFrame(update);
            
            group.update(_time);//追加分
            tween.chain(tween2);
           
            tween2.chain(tween3);

            tween3.chain(tween4);
         
            tween4.chain(tween);

            greenCubeTween.chain(greenCubeTween2);
            greenCubeTween2.chain(greenCubeTween3);

            greenCubeTween3.chain(greenCubeTween4);
            greenCubeTween4.chain(greenCubeTween);

    
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
