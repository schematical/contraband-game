import * as PIXI from "pixi.js";
import {Helper} from '../util/Helper';
import _ from 'underscore';

class Tile{
    constructor(data){
        this.lot = data.lot;
        this.building = data.building;
        this.x = data.x;
        this.y = data.y;

    }
    render(container){

        var canvas = document.getElementById("sketchPad")
        var ctx = canvas.getContext('2d');

        let size = 14;
        var img = new ImageData(size, size);

        let color = Helper.hexToRgb(this.building.primaryMaterial.color);
        let i = 0;
        for(let x = 0; x < size; x++){

            for(let y = 0; y < size; y++){
                img.data[i * 4] = color.r;
                img.data[i * 4 + 1] = color.g;
                img.data[i * 4 + 2] = color.b;
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
        const sprite = new PIXI.Sprite((texture));// this.lot.app.textures.bunny ));
        //sprite.anchor.set(0.5);
        sprite.x = (this.x) * 16;
        sprite.y = (this.y) * 16;
        container.addChild(sprite);
        // Opt-in to interactivity
        sprite.interactive = true;

// Shows hand cursor
        sprite.buttonMode = true;

// Pointers normalize touch and mouse
        sprite.on('pointerdown', _.bind(this.onPointerDown, this));
        sprite.on('pointerover',  _.bind(this.onPointerOver, this));
        sprite.on('pointerout',  _.bind(this.onPointerOut, this))

            //.on('pointerup', onButtonUp)
            //.on('pointerupoutside', onButtonUp)


    }
    onPointerDown(){

    }
    onPointerOver(){
        let buildingReg = this.lot.app.registry.buildings.get(this.building.type );
        let debugText = buildingReg.name + "(" + this.lot.x + "." + this.x + ", " + this.lot.y + '.' + this.y + ")";
        this.lot.app.setState({text: debugText});

    }
    onPointerOut(){

    }

}
export default Tile;