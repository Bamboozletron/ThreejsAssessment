import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/** Extension of OrbitControls but just disable pan/rotate by default */
export class StationaryOrbit extends OrbitControls
{
    constructor(object: THREE.Camera, domElement?: HTMLElement | undefined)
    {
        super(object, domElement);
        this.enablePan = false;
        this.enableRotate = false;
    }
}