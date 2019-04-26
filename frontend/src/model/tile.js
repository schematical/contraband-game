import * as PIXI from "pixi.js";
import {Helper} from '../util/Helper';
import _ from 'underscore';

class Tile{
    constructor(data){
      _.extend(this, data);

    }
    render(container){
        let size = 16;
        let texture = this.lot.app.textureManager.getBuildingTileDefault(this);
        this.sprite = new PIXI.Sprite(texture);
        //sprite.anchor.set(0.5);
        this.sprite.x = (this.x) * size;
        this.sprite.y = (this.y) * size;
        this.sprite.width = size;
        this.sprite.height = size;
        container.addChild(this.sprite);
        // Opt-in to interactivity
        /*this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
        this.sprite.on('pointerover',  _.bind(this.onPointerOver, this));
        this.sprite.on('pointerout',  _.bind(this.onPointerOut, this))
*/
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