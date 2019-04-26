import _ from 'underscore';
import {Helper} from "../util/Helper";
import * as PIXI from "pixi.js";
import  names from '../data/names';
class NPC{
    static get Type(){
        return {
            ZOMBIE: "ZOMBIE",
            HUMAN: "HUMAN"
        }
    }

    constructor(data){
        this.traits = [];
        this.stats = {};
        _.extend(this, data);


    }
    populateDefaults(){
        //Iterate through all stats
        let stats = this.app.registry.npc_stats.list();

        Object.keys(stats).forEach((namespace)=>{
            this.stats[namespace] = stats[namespace].startValue;
        })
    }
    populateRandom(){

        this.name = names[Math.floor(Math.random() * names.length)] += " ";
        this.name += names[Math.floor(Math.random() * names.length)].substr(0,1) + '.';
        this.occupation  = this.app.registry.occupations.rnd();

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
    attemptLotTransition(x, y) {
        let debutId = (this.name || (this.type + " " + this.id));
        console.log("ATTEMPTING TRANSITION: " + debutId, x, y);
        //Check for walls?
        let destLot = this.app.map.get(this.lot.x + x, this.lot.y + y, {autoGen: false});
        if (!this.faction) {
            if (_.isNull(destLot)) {
                console.log("CHUCK NOT LOADED, SLEEPING: ", debutId);
                this.app.sleepNPC(this);
                return true;
            }else{
                this.transitioningLots = true;

                let newX = this.goalLotPos.x;
                if(x < 0){
                    newX =  3.9;
                }else if( x > 0){
                    newX = .1;
                }
                let newY = this.goalLotPos.y;
                if(y < 0){
                    newY = 3.9;
                }else if( y > 0){
                    newY = .1;
                }
                this.goalLotPos = {
                    x: newX,
                    y: newY
                }
                let tile = destLot.getTile(Math.floor(this.goalLotPos.x), Math.floor(this.goalLotPos.y));
                if(tile){
                    //There is a building there.
                    return false;

                }
                this.lot.removeNPC(this);

                destLot.addNPC(this);
                this.sprite.setParent(destLot.sprite);
                console.log("CHUCKLOADED, Moving: ", debutId, this.goalLotPos);
                return true;
            }

        }

        //TODO Check faction stuff secodn
        if (_.isNull(destLot)) {
            //TODO: Generate in real time and re check

        }
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
        this.goalLotPos = {};
        this.goalLotPos.x = this.lotPos.x + this.velocity.x * .01 * delta;
        this.goalLotPos.y = this.lotPos.y + this.velocity.y * .01 * delta;

        if(this.goalLotPos.x < 0){
            //Test if can wonder west
            if(!this.attemptLotTransition( -1, 0)){
                return this.changeVelocity();
            }
        }
        if(this.goalLotPos.x > 4){
            //Test if can wonder west
            if(!this.attemptLotTransition( 1, 0)){
                return this.changeVelocity();
            }
        }
        if(this.goalLotPos.y < 0){
            //Test if can wonder west
            if(!this.attemptLotTransition( 0, -1)){
                return this.changeVelocity();
            }
        }
        if(this.goalLotPos.y > 4){
            //Test if can wonder west
            if(!this.attemptLotTransition( 0, 1)){
                return this.changeVelocity();
            }
        }

        let tile = this.lot.getTile(Math.floor(this.goalLotPos.x), Math.floor(this.goalLotPos.y));
        if(tile){
            //There is a building there.
            return this.changeVelocity();

        }
        this.lotPos = this.goalLotPos;
        this.goalLotPos = null;
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
    guiDeselect(){

    }
    sleep(){
        this.sprite.visible = false;
    }
    destroy(){
        this.sprite.destroy();
    }

}
export default NPC;