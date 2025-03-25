import * as THREE from 'three';
class GameObject{

    constructor(name, origin){
        this.name=name;
        this.origin=origin;
    }

    add_to_scene(scene){
        scene.add(this)
    }
}