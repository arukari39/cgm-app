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

        const generateSprite = () =>{
        const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
        
             //円形のグラデーションの作成
             const context = canvas.getContext('2d')!;
             const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
             gradient.addColorStop(0, 'rgb(255, 0, 0)');
             gradient.addColorStop(0.2, 'rgb(173, 28, 28)');
             gradient.addColorStop(0.4, 'rgb(255, 0, 0)');
             gradient.addColorStop(1, 'rgba(0,0,0,1)');
            
             context.fillStyle = gradient;
             context.fillRect(0, 0, canvas.width, canvas.height);
             //テクスチャの生成
             const texture = new THREE.Texture(canvas);
             texture.needsUpdate = true;
             return texture;
        }

        const particleNum = 10000;
        
        const positions = new Float32Array(particleNum * 3);
        const geometry = new THREE.BufferGeometry();
       geometry.setAttribute(
      "position",
       new THREE.BufferAttribute(positions, 3)
       );

     const particles = createPoints(geometry);


        for (let i = 0; i < particleNum; i++) {
        
       positions[i * 3 + 0] = 0;
       positions[i * 3 + 1] = 0;
       positions[i * 3 + 2] = 0;
       }

    const sphereGeometry = new THREE.SphereGeometry(5,60,60);
    const spherePos = sphereGeometry.getAttribute("position") as THREE.BufferAttribute;

    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5,20, 20, 20);
    const cubePos = cubeGeometry.getAttribute("position") as THREE.BufferAttribute;

    const torusGeometry = new THREE.TorusGeometry(5,1,16,50);
    const torusPos = torusGeometry.getAttribute("position") as THREE.BufferAttribute;

    const coneGeometry = new THREE.ConeGeometry(5, 5, 32,32);
    const conePos = coneGeometry.getAttribute("position") as THREE.BufferAttribute;

       for(let i = 0; i < particleNum; ++i) {
    // tweeninfoの作成
    const tweeninfo = { x: 0, y: 0, z: 0, index: i};
    // Tweenでパラメータの更新の際に呼び出される関数の作成
    const updatePosition = () => {
        const index = tweeninfo.index;
        positions[index * 3 + 0] = tweeninfo.x;
        positions[index * 3 + 1] = tweeninfo.y;
        positions[index * 3 + 2] = tweeninfo.z;
        geometry.attributes.position.needsUpdate = true;
    };
    
    // 球面上の座標値の作成（遷移先の作成）
    const sphereindex = i % spherePos.count;
    const cubeindex = i % cubePos.count;
    const torusindex = i % torusPos.count;
    const coneindex = i % conePos.count;

    const shapelist = [
        {
            targetX:spherePos.getX(sphereindex),
            targetY:spherePos.getY(sphereindex),
            targetZ:spherePos.getZ(sphereindex)     
        },
        {
            targetX:cubePos.getX(cubeindex),
            targetY:cubePos.getY(cubeindex),
            targetZ:cubePos.getZ(cubeindex)     
        },
        {
            targetX:torusPos.getX(torusindex),
            targetY:torusPos.getY(torusindex),
            targetZ:torusPos.getZ(torusindex)     
        },
        {
            targetX:conePos.getX(coneindex),
            targetY:conePos.getY(coneindex),
            targetZ:conePos.getZ(coneindex)     
        }

    ];

    // Twennの作成（球面上への遷移と、原点への遷移を作る）
    const tweenBall = new TWEEN.Tween(tweeninfo).delay(500).to({x:shapelist[0].targetX,y:shapelist[0].targetY,z:shapelist[0].targetZ}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatePosition);
    const tweenCube = new TWEEN.Tween(tweeninfo).delay(500).to({x:shapelist[1].targetX,y:shapelist[1].targetY,z:shapelist[1].targetZ}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatePosition);
    const tweenTorus = new TWEEN.Tween(tweeninfo).delay(500).to({x:shapelist[2].targetX,y:shapelist[2].targetY,z:shapelist[2].targetZ}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatePosition);
    const tweenCone = new TWEEN.Tween(tweeninfo).delay(500).to({x:shapelist[3].targetX,y:shapelist[3].targetY,z:shapelist[3].targetZ}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatePosition);
    const tweenBack = new TWEEN.Tween(tweeninfo).delay(500).to({x:0,y:0,z:0}, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(updatePosition);

    // アニメーションのループの作成
    const group = new TWEEN.Group();
          group.add(tweenBall);
          group.add(tweenTorus);
          group.add(tweenCube);
          group.add(tweenCone);
          group.add(tweenBack);
    tweenBall.chain(tweenCube);
    tweenCube.chain(tweenTorus);
    tweenTorus.chain(tweenCone);
    tweenCone.chain(tweenBack);
    tweenBack.chain(tweenBall);

    // アニメーションの実行
    tweenBall.start();
     const update: FrameRequestCallback = (_time) => {

            group.update(_time);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

       

     this.scene.add(particles);


        
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
       
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();

    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 6, 15));
    document.body.appendChild(viewport);
}
