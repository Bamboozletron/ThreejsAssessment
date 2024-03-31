import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { ScaleVisualComponent } from './ScaleVisualComponent';

/**
 * Component to track weight on the scale
 */
export class ScaleWeightComponent extends Component
{
        private params: any;

        // Weight display
        private changingWeight: boolean = false;
        private currentWeight: number = 0;    
        private beginningWeight: number = 0;
        private targetWeight: number = 0;
    
        private readonly timeToChange: number = 1.0;
        private timeProgress: number = 0;
    
        private scaleDigitsToShow: number = 9;

        private visualComponent!: ScaleVisualComponent | null; 

        Occupied: boolean = false;

        constructor(params: any)
        {
            super();
            this.params = params;
        }

        InitializeEntity() 
        {
            this.visualComponent = <ScaleVisualComponent>this.Entity?.GetComponent("ScaleVisualComponent");
        }

        /**
         * Set new target for scale weight to lerp to
         * @param targetWeight target weight
         */
        ChangeScaleWeight(targetWeight: number)
        {        
            this.timeProgress = 0.0;
            this.targetWeight = targetWeight;    
            this.beginningWeight = this.currentWeight;
            this.changingWeight = true;
        }

        /**
         * Format the given weight
         * @param weight weight as number
         * @returns weight as formatted string
         */
        private formatWeight(weight: number): string
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
    
    
        /**
         * Split into it's own function because I was going to mess with some different functions to lerp with but haven't come back to it
         */
        private interpolateWeight(start: number, end: number, progress: number): number
        {
            return THREE.MathUtils.lerp(start, end, progress);        
        }

        
        Update(delta: number)        
        {
            // Lerp to target weight while setting the visual on the scale            
            if (this.changingWeight)
            {
                if (this.timeProgress <= this.timeToChange)
                {
                    this.currentWeight = this.interpolateWeight(this.beginningWeight, this.targetWeight, this.timeProgress/this.timeToChange);
                    this.timeProgress+= delta;            
        
                    this.visualComponent?.SetScaleWeightTexture(this.formatWeight(this.currentWeight));
                }
                else
                {
                    this.changingWeight = false;
                    this.timeProgress = 0;
                    this.currentWeight = this.targetWeight;
        
                    this.visualComponent?.SetScaleWeightTexture(this.formatWeight(this.currentWeight));
                }
            }
        }
}