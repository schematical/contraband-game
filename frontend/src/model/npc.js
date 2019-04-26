import _ from 'underscore';
import {Helper} from "../util/Helper";
import * as PIXI from "pixi.js";
class NPC{
    static get Type(){
        return {
            ZOMBIE: "ZOMBIE",
            HUMAN: "HUMAN"
        }
    }

    constructor(data){

        _.extend(this, data);


    }
    render(container){

        var canvas = document.getElementById("sketchPad")
        var ctx = canvas.getContext('2d');

        let size = 4;
        ctx.clearRect(0,0,  canvas.width, canvas.height);
        var img = new ImageData(size, size);
        let colorStr = "#ff0000";//"#666666";

        switch(this.type){
            case(NPC.Type.ZOMBIE):
                colorStr = "#008800";

            break;


        }
        let color = Helper.hexToRgb(colorStr);
        let i = 0;
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){


                let multiplier = 1;

                img.data[i * 4] = color.r * multiplier;
                img.data[i * 4 + 1] = color.g * multiplier;
                img.data[i * 4 + 2] = color.b * multiplier;
                img.data[i * 4 + 3] = 255;

                //bmp.pixel[x][y] = color;
                i++;
            }
        }

        ctx.putImageData(img, 0, 0);
        //	set pixel colour, components in the range [0, 1]
        //bmp.subsample(n)//	scale down by integer factor n
        let url = canvas.toDataURL()

        let texture = PIXI.Texture.fromImage(url);
        this.sprite = new PIXI.Sprite((texture));// this.lot.app.textures.bunny ));
        //sprite.anchor.set(0.5);
        this.updateScreenPos();
        container.addChild(this.sprite);
        // Opt-in to interactivity
        this.sprite.interactive = true;

// Shows hand cursor
        this.sprite.buttonMode = true;

// Pointers normalize touch and mouse
        this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
        this.sprite.on('pointerover',  _.bind(this.onPointerOver, this));
        this.sprite.on('pointerout',  _.bind(this.onPointerOut, this))

    }
    onPointerDown(){
        this.lot.app.setState({selected_npc: this});
    }
    onPointerOver(){
        let debugText = this.type + "(" + this.lotPos.x + ", " + this.lotPos.y + ")";
        this.lot.app.setState({text: debugText});

    }
    onPointerOut(){
        this.lot.app.setState({text: ""});
    }
    wonder(delta){
        if(!this.sprite){
            return;
        }
        if(!this.velocity){
            this.velocity = {
                x: Math.round(this.lot.app.rnd() * 2) - 1,
                y: Math.round(this.lot.app.rnd() * 2) - 1
            }
        }
        this.lotPos.x += this.velocity.x * .01 * delta;
        this.lotPos.y += this.velocity.y * .01 * delta;
        this.updateScreenPos();

    }
    updateScreenPos(){
        this.sprite.x = this.lotPos.x * 16;
        this.sprite.y = this.lotPos.y * 16;
    }

}
export default NPC;