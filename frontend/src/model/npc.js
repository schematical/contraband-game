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


        let texture = null;

        switch(this.type){
            case(NPC.Type.ZOMBIE):
                texture = this.lot.app.textureManager.getNPCZombieObservedDefault();

            break;
            case(NPC.Type.HUMAN):
                if(this.faction) {//TODO: Check if its the players faction
                    texture = this.lot.app.textureManager.getNPCAllieObservedDefault();
                }else{
                    texture = this.lot.app.textureManager.getNPCCivilianObservedDefault();
                }


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
        if(
            !this.velocity ||
            Math.round(this.lot.app.rnd() * 20) == 1
        ){
          this.changeVelocity();
        }
        let goalX = this.lotPos.x + this.velocity.x * .01 * delta;
        let goalY = this.lotPos.y + this.velocity.y * .01 * delta;

        if(
            goalX < 0 ||
            goalX > 3 ||
            goalY < 0 ||
            goalY > 3

        ){

            return this.changeVelocity();//
        }
        let tile = this.lot.getTile(Math.floor(goalX), Math.floor(goalY));
        if(tile){
            //There is a building there.
            return this.changeVelocity();
        }
        this.lotPos.x = goalX;
        this.lotPos.y = goalY;
        this.updateScreenPos();

    }
    changeVelocity(){
        this.velocity = {
            x: Math.round(this.lot.app.rnd() * 2) - 1,
            y: Math.round(this.lot.app.rnd() * 2) - 1
        }
    }
    updateScreenPos(){
        this.sprite.x = this.lotPos.x * 16;
        this.sprite.y = this.lotPos.y * 16;
    }

}
export default NPC;