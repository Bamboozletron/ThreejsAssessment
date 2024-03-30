import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { ScaleVisualComponent } from './ScaleVisualComponent';
import { MousePointerComponent } from '../MouseHandlingComponent/MousePointerComponent';

export class ScaleWeightComponent extends Component
{

        private params: any;

        // Weight display
        private changingWeight: boolean = false;
        private currentWeight: number = 0;    
        private beginningWeight: number = 0;
        private targetWeight: number = 0;
    
        private readonly timeToChange: number = 2.0;
        private timeProgress: number = 0;
    
        private scaleDigitsToShow: number = 9;

        private visualComponent!: ScaleVisualComponent | null; 
        private mousePointerComponent!: MousePointerComponent | null; 

        constructor(params: any)
        {
            super();
            this.params = params;
        }

        initializeEntity() 
        {
            this.visualComponent = <ScaleVisualComponent>this.entity?.getComponent("ScaleVisualComponent");
            document.addEventListener('keyup', event => this.onKeyUp(event), false);

            this.mousePointerComponent = this.params.scene.entityManager.getEntity("MousePointerEntity").getComponent("MousePointerComponent");
        }
        
        initializeComponent()
        {
        }

        changeScaleWeight(targetWeight: number)
        {        
            this.timeProgress = 0.0;
            this.targetWeight = targetWeight;    
            this.beginningWeight = this.currentWeight;
            this.changingWeight = true;
        }

        formatWeight(weight: number): string
        {        
            var weightString = weight.toFixed(2) + "g";
            const length = weightString.length;
            if (length < this.scaleDigitsToShow)
            {
                const toAdd = this.scaleDigitsToShow - length;
                for (let i = 0; i < toAdd; i++)
                {
                    weightString = "0" + weightString;
                }
            }
            return weightString;
        }
    
    
        // Splitting into it's own function to mess with other curves possibly
        interpolateWeight(start: number, end: number, progress: number): number
        {
            //  Simple lerp, haven't figured math out for other ones and am wasting time
            return THREE.MathUtils.lerp(start, end, progress);        
        }

        update(delta: number)
        {
            if (this.changingWeight)
            {
                if (this.timeProgress <= this.timeToChange)
                {
                    this.currentWeight = this.interpolateWeight(this.beginningWeight, this.targetWeight, this.timeProgress/this.timeToChange);
                    this.timeProgress+= delta;            
        
                    this.visualComponent?.setScaleWeightTexture(this.formatWeight(this.currentWeight));


                }
                else
                {
                    this.changingWeight = false;
                    this.timeProgress = 0;
                    this.currentWeight = this.targetWeight;
        
                    this.visualComponent?.setScaleWeightTexture(this.formatWeight(this.currentWeight));
                }
            }

            console.log("FART" + this.mousePointerComponent!.pointerPos);
        }

        onKeyUp(event: KeyboardEvent)
        {
            switch (event.code)
            {
                case "Space":
                    console.log("SPACE");
                    this.changeScaleWeight(this.currentWeight + 100.0);
                    break;
            }
        }
}