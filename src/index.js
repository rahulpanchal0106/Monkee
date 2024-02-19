import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

// const THREE = require('three')
// const {GLTFLoader} = require('three/addons/loaders/GLTFLoader.js')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100,window.innerWidth/window.innerHeight,0.1,100);
camera.position.set(2,10,0);
// camera.rotation.y=30;
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
// window.onresize=(event)=>{
//     // camera.fov.toPrecision(2,"two")
//     // renderer.setSize(window.innerWidth,window.innerHeight);
//     alert('Refresh the Page to fix the view')
// }
const light = new THREE.AmbientLight(0xff99ff,10,0x111111);
// scene.add(light)
const light1 = new THREE.DirectionalLight(0x888888,1)
scene.add(light1)
light1.castShadow=true
// light1.position.set(100,1,0)
const output = renderer.domElement;
const output_display = document.querySelector('#output');

output_display.appendChild(output);
let obj;
let light2;
let text;
let gnd;
let monkee;
const loader = new GLTFLoader();
var obj_animations,animationMixer;
loader.load('./monkee.glb',
    (gltf)=>{
        obj = gltf.scene;
        obj_animations = gltf.animations;
        
        if(obj_animations && obj_animations.length){
            console.log("===========>",obj_animations.length);
            animationMixer = new THREE.AnimationMixer(obj);
            const animationClip = obj_animations[0];
            const animationAction = animationMixer.clipAction(animationClip);
            animationAction.play();

        }
        scene.add(obj);
        obj.position.set(0,0,0)
        obj.rotation.set(0,Math.PI,0)
        obj.scale.set(2,2,2)
        text = gltf.scene.children[0].children[1];
        gnd = gltf.scene.children[0].children[0];
        monkee = gltf.scene.children[0].children[2];
        
        console.log('gltf: ',gltf,"\nLight2: ",light2,"\nText: ",text,"\nGnd: ",gnd)
        

        // obj.traverse((child)=>{
        //     if(child instanceof THREE.Mesh){
        //         child.material = new THREE.MeshPhongMaterial({wireframe:false,shininess:100})
        //     }
        // })
        
        gnd.receiveShadow=true
        gnd.material=new THREE.MeshDepthMaterial()
        text.material=new THREE.MeshPhongMaterial({
            color:0x111111,
            specular: 0xffffff,
            shine:32.5
        });
        text.receiveShadow=false
        text.castShadow=false;
        // text.material.specular=0xffffff;
        // text.material.color=0x111111;
        console.log(`text.material.specular: `,text.material.specular);
        text.material.shininess=32.30
        text.material.emissive=0
        text.material.reflectivity=3.50
        light2 = gltf.scenes[0].children[1]
        // light2.castShadow=false
        
        
    },
    (xhr)=>{
        let loading_perc = xhr.loaded/xhr.total*100;
        let rounded_loading_perc=Number(loading_perc.toFixed(2));
        console.log(`${loading_perc}% loaded`)
        if(loading_perc!=100){
            circle.innerHTML=`<div id="loading">Loading ${rounded_loading_perc}%</div>`
        }else{
            circle.innerHTML=``;
            circle.style.width='1px'
            circle.style.height='1px'
        }
    },
    (err)=>{
        console.log(err);
    }
)

function animate(){
    requestAnimationFrame(animate);
    
    if(obj_animations && obj_animations.length){
        console.log('$$$$$$$$$$$$$');
        animationMixer.update(0.0167);
    }
    if(obj){
        // obj.rotation.x+=0.01
        // obj.rotation.y+=0.01
        // obj.rotation.z+=0.01
    }
    renderer.render(scene,camera);

}
const circle = document.querySelector('#circle');
const body = document.querySelector('body')
body.onmousemove=(event)=>{
    console.log(event.clientX,event.clientY)
    const mouseX = (window.innerWidth/2)-event.clientX
    const mouseY = (window.innerHeight/2)-event.clientY
    circle.style.top=`${event.clientY}px`;
    circle.style.left=`${event.clientX}px`;
    light1.position.x=-mouseX
    light1.position.y=mouseY
    // if(light2){
    //     light2.position.x=-mouseX
    // }
    
    circle.style.transition="height 0.2s cubic-bezier(0, 0, 0.12, 1.5)"
    circle.style.transition="width 0.2s cubic-bezier(0, 0, 0.12, 1.5)"
    console.log(`Mouse Poisition wrt Center: {${mouseX},${mouseY}}\nCircle: {${circle.style.top}}`)
}
const top_h1 =document.querySelector('#TOP').querySelector('h1');
    // top_h1.onmousemove=(event)=>{
    //     console.log('------------------------------------');
    //     circle.style.width="50px";
    //     circle.style.height="50px";
    // }
// const mouse = THREE.MOUSE;
const top=document.querySelector('#TOP');
const bottom=document.querySelector('#BOTTOM');
const footer = document.querySelector('footer');
let i=0;
let j=0;
let o=0;
if(window.innerWidth<=768 && window.innerHeight<=1024){
    console.log("Not a big screen");
    let touchStartY;
    camera.position.y=30
    body.ontouchstart=(event)=>{
        touchStartY=event.touches[0].clientY;
    }
    body.ontouchmove=(event)=>{
        console.log(event);
        let deltaY=-(event.touches[0].clientY-touchStartY)
        console.log(`Wheel: ${deltaY}\nTotal Wheel:${obj.scale}\ncamera.position: x:${camera.position.x} y:${camera.position.y} z:${camera.position.z}`);
    console.log(obj.scale)

    if(camera.position.x==2 && camera.position.y==30 && camera.position.z==0){
        console.log("@@@@@@@@@@@@@@@@@@@CENTER@@@@@@@@@@@@@@@");
        top.style.opacity=0
        bottom.style.opacity=0
        i=0;
        j=0;
        // footer.style.opacity=1
        
    }
    if(camera.position.x>=3 && camera.position.y>=31 && camera.position.z<=-11){
        console.log("@@@@@@@@@@@@@@@@@@@TOP@@@@@@@@@@@@@@@");
        
        top.style.opacity=1;
        bottom.style.opacity=0;
        circle.style.width='50px'
        circle.style.height='50px'
        footer.style.opacity=0
        top.style.zIndex=10
        bottom.style.zIndex=1
        // top.style.opacity=i/1000*3;

        
    }else{
        top.style.opacity=0;
        circle.style.width='5px'
        circle.style.height='5px'
        footer.style.opacity=0
        top.style.zIndex=1
        bottom.style.zIndex=10
    }
    if(camera.position.x>=0.1 && camera.position.y>=28 && camera.position.z>=10){
        console.log("@@@@@@@@@@@@@@@@@@@BOTTOM@@@@@@@@@@@@@@@");
        top.style.opacity=0
        bottom.style.opacity=1
        circle.style.width='50px'
        circle.style.height='50px'
        footer.style.opacity=0
        top.style.zIndex=1
        bottom.style.zIndex=10
        // output.style.width='10%';

    }else{
        bottom.style.opacity=0;
        circle.style.width='5px'
        circle.style.height='5px'
        footer.style.opacity=1
        top.style.zIndex=10
        bottom.style.zIndex=1
        
    }
    let num=7
    if(deltaY<0 && camera.position.x<=4 && camera.position.y<=32 && camera.position.z>=-21){
        obj.scale.x-=0.03/num
        obj.scale.y-=0.03/num
        obj.scale.z-=0.03/num
        camera.position.z+=-1/num
        camera.rotation.x+=-0.05/num
        
        camera.rotation.y+=0.1/num
        camera.position.x+=0.1/num
        camera.position.y+=0.1/num
        light2.position.z+=1/num
        i+=0.3;
        j-=0.6
        top.style.top=`${i}px`;
        bottom.style.bottom=`${j}px`;

        // o+=i/1500
        // top.style.opacity=o;
        // bottom.style.opacity=o;
        // light2.position.y=10
        // light2.position.x=-10
        // obj.rotation.y+=0.09
        // obj.rotation.x+=0.01
        // obj.rotation.z+=0.09

    }else if(deltaY>=0 && camera.position.x>=0.3 && camera.position.y>=28.3 && camera.position.z<=17){
        obj.scale.x+=0.03/num
        obj.scale.y+=0.03/num
        obj.scale.z+=0.03/num
        i-=0.3;
        top.style.top=`${i}px`;
        j+=0.6;
        bottom.style.bottom=`${j}px`;
        light2.position.z-=1/num
        camera.position.z-=-1/num
        camera.rotation.x-=-0.05/num
        camera.rotation.y-=0.1/num
        camera.position.x-=0.1/num
        camera.position.y-=0.1/num


        // o-=i/1500
        // top.style.opacity=o;
        // bottom.style.opacity=o;
        // obj.rotation.y-=0.09
        // obj.rotation.x-=0.01
        // obj.rotation.z-=0.09
    }

    // top.onmousemove=()=>{
    //     circle.style.width="5px";
    //     circle.style.height="5px";
    // }
    }
}else{
    console.log("A BIG SCREEN")
    body.onwheel=(event)=>{
        console.log(`Wheel: ${event.deltaY}\nTotal Wheel:${obj.scale}\ncamera.position: x:${camera.position.x} y:${camera.position.y} z:${camera.position.z}`);
        console.log(obj.scale)
    
        if(camera.position.x==2 && camera.position.y==10 && camera.position.z==0){
            console.log("@@@@@@@@@@@@@@@@@@@CENTER@@@@@@@@@@@@@@@");
            top.style.opacity=0
            bottom.style.opacity=0
            i=0;
            j=0;
            // footer.style.opacity=1
            
        }
        if(camera.position.x>=3 && camera.position.y>=11 && camera.position.z<=-11){
            console.log("@@@@@@@@@@@@@@@@@@@TOP@@@@@@@@@@@@@@@");
            
            top.style.opacity=1;
            bottom.style.opacity=0;
            circle.style.width='50px'
            circle.style.height='50px'
            footer.style.opacity=0
            // top.style.opacity=i/1000*3;
    
            
        }else{
            top.style.opacity=0;
            circle.style.width='5px'
            circle.style.height='5px'
            footer.style.opacity=0
        }
        if(camera.position.x>=0.1 && camera.position.y>=8 && camera.position.z>=10){
            console.log("@@@@@@@@@@@@@@@@@@@BOTTOM@@@@@@@@@@@@@@@");
            top.style.opacity=0
            bottom.style.opacity=1
            circle.style.width='50px'
            circle.style.height='50px'
            footer.style.opacity=0
            // output.style.width='10%';
    
        }else{
            bottom.style.opacity=0;
            circle.style.width='5px'
            circle.style.height='5px'
            footer.style.opacity=1
            
        }
        let num=5
        if(event.deltaY<0 && camera.position.x<=4 && camera.position.y<=12 && camera.position.z>=-21){
            obj.scale.x-=0.03/num
            obj.scale.y-=0.03/num
            obj.scale.z-=0.03/num
            camera.position.z+=-1/num
            camera.rotation.x+=-0.05/num
            
            camera.rotation.y+=0.1/num
            camera.position.x+=0.1/num
            camera.position.y+=0.1/num
            light2.position.z+=1/num
            i+=0.3;
            j-=0.6
            top.style.top=`${i}px`;
            bottom.style.bottom=`${j}px`;
    
            // o+=i/1500
            // top.style.opacity=o;
            // bottom.style.opacity=o;
            // light2.position.y=10
            // light2.position.x=-10
            // obj.rotation.y+=0.09
            // obj.rotation.x+=0.01
            // obj.rotation.z+=0.09
    
        }else if(event.deltaY>=0 && camera.position.x>=0.3 && camera.position.y>=8.3 && camera.position.z<=17){
            obj.scale.x+=0.03/num
            obj.scale.y+=0.03/num
            obj.scale.z+=0.03/num
            i-=0.3;
            top.style.top=`${i}px`;
            j+=0.6;
            bottom.style.bottom=`${j}px`;
            light2.position.z-=1/num
            camera.position.z-=-1/num
            camera.rotation.x-=-0.05/num
            camera.rotation.y-=0.1/num
            camera.position.x-=0.1/num
            camera.position.y-=0.1/num
    
    
            // o-=i/1500
            // top.style.opacity=o;
            // bottom.style.opacity=o;
            // obj.rotation.y-=0.09
            // obj.rotation.x-=0.01
            // obj.rotation.z-=0.09
        }
    
        // top.onmousemove=()=>{
        //     circle.style.width="5px";
        //     circle.style.height="5px";
        // }
        
    }
}

animate();