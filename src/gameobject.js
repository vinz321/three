import * as THREE from 'three';
import * as CANNON from 'cannon-es';
class GameObject{

    constructor(obj_name, geometry, material, scene, world,
                position = new THREE.Vector3(0, 0, 0),  
                rotation = new THREE.Quaternion(), 
                scale = new THREE.Vector3(1, 1, 1),
                physicsBodyProperties = {}, physicsShape=null) {
        
        this.obj_name = obj_name;
        this.geometry = geometry;
        this.material = material;
        this.scene = scene;
        this.world = world;
        this.position = position;
        this.rotation = rotation; 
        this.scale = scale;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        this.mesh.quaternion.x = this.rotation.x;
        this.mesh.quaternion.y = this.rotation.y;
        this.mesh.quaternion.z = this.rotation.z;
        this.mesh.quaternion.w = this.rotation.w;
        this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        

        this.createPhysicsBody(physicsBodyProperties);
        if(!physicsShape){
            this.body.addShape(new CANNON.Box(new CANNON.Vec3(this.geometry.parameters.width/2, this.geometry.parameters.height/2, this.geometry.parameters.depth/2)));
            console.log("CREATED BOX SHAPE FOR OBJECT "+this.name);
        }else{
            this.body.addShape(physicsShape);

        }
        
    }

    createPhysicsBody(properties={}){
        
        var def_properties = {
            mass:1,
            // angularDamping:0.5,
            // fixedRotation:true
        }

        const merged={... def_properties, ...properties}

        this.body=new CANNON.Body(merged);

        this.body.position.x=this.position.x;
        this.body.position.y=this.position.y;   
        this.body.position.z=this.position.z;

        this.body.quaternion.x=this.rotation.x;
        this.body.quaternion.y=this.rotation.y;
        this.body.quaternion.z=this.rotation.z;
        this.body.quaternion.w=this.rotation.w;
        this.body.name=this.obj_name;

        this.body.addEventListener("collide", function(event){
            console.log("Collision detected between "+event.body.name+" and "+event.target.name);
            // console.log(event);
        });
        
    }

    instantiate(){
        this.scene.add(this.mesh);
        this.world.addBody(this.body);
    }

    update(){
        this.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.rotation.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);

        this.mesh.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.mesh.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
        
        
        // console.log("Updating GameObject "+this.obj_name+" with position "+this.position.toArray()+" and rotation "+this.rotation.toArray());
    }
}

export {GameObject};