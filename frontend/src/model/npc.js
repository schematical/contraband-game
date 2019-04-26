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


        let texture = this.lot.app.textureManager.getNPCCivilianObservedDefault();

        switch(this.type){
            case(NPC.Type.ZOMBIE):
                texture = this.lot.app.textureManager.getNPCZombieObservedDefault();

            break;


        }


        this.sprite = new PIXI.Sprite(texture);
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