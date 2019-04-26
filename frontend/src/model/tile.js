import * as PIXI from "pixi.js";
import {Helper} from '../util/Helper';
import _ from 'underscore';

class Tile{
    constructor(data){
      _.extend(this, data);

    }
    render(container){

        var canvas = document.getElementById("sketchPad")
        var ctx = canvas.getContext('2d');

        let size = 16;
        ctx.clearRect(0,0,  canvas.width, canvas.height);
        var img = new ImageData(size, size);

        let color = Helper.hexToRgb(this.building.primaryMaterial.color);
        let i = 0;
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){


                let multiplier = 1;
                if(this.bottom && y > size / 2) {
                    multiplier = .5;
                }
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
        this.sprite.x = (this.x) * 16;
        this.sprite.y = (this.y) * 16;
        container.addChild(this.sprite);
        // Opt-in to interactivity
        this.sprite.interactive = true;

// Shows hand cursor
        this.sprite.buttonMode = true;

// Pointers normalize touch and mouse
        this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
        this.sprite.on('pointerover',  _.bind(this.onPointerOver, this));
        this.sprite.on('pointerout',  _.bind(this.onPointerOut, this))

            //.on('pointerup', onButtonUp)
            //.on('pointerupoutside', onButtonUp)


    }
    onPointerDown(){
        this.lot.app.setState({selected_building: this.building});
    }
    onPointerOver(){
        let buildingReg = this.lot.app.registry.buildings.get(this.building.type );
        let debugText = buildingReg.name + "(" + this.lot.x + "." + this.x + ", " + this.lot.y + '.' + this.y + ")";
        this.lot.app.setState({text: debugText});

    }
    onPointerOut(){
        this.lot.app.setState({text: ""});
    }

}
export default Tile;