import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class StationaryOrbit extends OrbitControls
{
    constructor(object: THREE.Camera, domElement?: HTMLElement | undefined)
    {
        super(object, domElement);
        // this.enablePan = false;
        // this.enableRotate = false;
    }
}