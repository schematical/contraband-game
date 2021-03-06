import * as PIXI from "pixi.js";
import {Helper} from '../util/Helper';
import _ from 'underscore';

class Tile{
    constructor(data){
      _.extend(this, data);

    }
    render(container,  _options){
        let options = {
            refresh: false
        };
        _.extend(options, _options);
        let size = 16;
        let texture = this.lot.app.textureManager.getBuildingTileDefault(this);
        if( options.refresh){
            //TODO: Delete the sprite
            this.sprite = null;
        }
        if(
            !this.sprite
        ) {
            this.sprite = new PIXI.Sprite(texture);
            //sprite.anchor.set(0.5);
            this.sprite.x = (this.x) * size;
            this.sprite.y = (this.y) * size;
            this.sprite.width = size;
            this.sprite.height = size;
            container.addChild(this.sprite);
            // Opt-in to interactivity
            this.sprite.interactive = true;
            this.sprite.buttonMode = true;
            this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
            this.sprite.on('pointerover',  _.bind(this.onPointerOver, this));
            this.sprite.on('pointerout',  _.bind(this.onPointerOut, this))
            //.on('pointerup', onButtonUp)
            //.on('pointerupoutside', onButtonUp)
        }


    }
    getGlobalPos(){
        return {
            x: this.lot.x + ((this.x  + .5) / 4),
            y: this.lot.y + ((this.y + .5) / 4)
        }
    }
    onPointerDown(e){

        if(!this.building){
            throw new Error("Missing `this.building`");
        }
        console.log(this.building.id + " FIRING");
        /*if(e.data._npc){
            return;
        }
        e.data._building = this.building;*/
        e.stopPropagation();
        this.lot.app.guiSelectBuilding(this.building);
    }
    onPointerOver(){
        let buildingReg = this.building.type;
        let debugText = buildingReg.name + "(" + this.lot.x + "." + this.x + ", " + this.lot.y + '.' + this.y + ")";
        this.lot.app.setState({text: debugText});

    }
    onPointerOut(){
        this.lot.app.setState({text: ""});
    }

}
export default Tile;