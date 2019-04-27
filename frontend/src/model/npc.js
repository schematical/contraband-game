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
        this.behaviors = [];
        this.awake = true;
        this.alive = true;
        this.tasks = [];
        _.extend(this, data);


    }
    addTask(task){
        task.npc = this;
        this.tasks.push(task);
        this.tasks = _.sortBy(this.tasks, (task)=>{
            return task.priority || 100;
        })
    }
    getCurrentTask(){
        return this.tasks[0] || null;
    }
    addAIBehavior(behavior){
        behavior.npc = this;
        this.behaviors.push(behavior);
        this.behaviors = _.sortBy(this.behaviors, (behavior)=>{
            return behavior.priority;
        })
    }
    populateDefaults(){
        //Iterate through all stats
        let stats = this.app.registry.npc_stats.list();

        Object.keys(stats).forEach((namespace)=>{
            this.stats[namespace] = this.app.registry.range(stats[namespace], "startRange", stats[namespace].startValue)
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


        //Check for walls?
        let destLot = this.app.map.get(this.lot.x + x, this.lot.y + y, {autoGen: false});
        if (this.faction) {
            return false;//TODO: Stop them from moving
        }
        if (_.isNull(destLot)) {

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
            this.sprite.setParent(destLot.sprite);
            return true;
        }

    }
    tick(){
        this.tickAI();
        this.tickPhysics();
        this.tickBiology();
    }
    tickBiology(){
        //Cause hunger
        //check damage

    }
    tickAI(){

        if(this.activeBehavior){
            if(this.activeBehavior.continueExecuting()){
                this.activeBehavior.execute();
                return;
            }else{
                this.activeBehavior = null;
            }

        }
        let index = 0;
        while(
            index < this.behaviors.length &&
            !this.activeBehavior
        ){

            let behavior = this.behaviors[index];

            if(behavior.shouldExecute()){
                this.activeBehavior = behavior;
            }
            index++;
        }
        if(!this.activeBehavior){
            return;
        }
        this.activeBehavior.execute();

    }
    tickPhysics(){
        if(!this.lotPos){
            return;
        }
        if(!this.velocity){
            this.velocity = {x:0, y: 0};
        }
        this.goalLotPos = {};
        this.goalLotPos.x = this.lotPos.x + this.velocity.x * .01;
        this.goalLotPos.y = this.lotPos.y + this.velocity.y * .01;

        if(this.goalLotPos.x < 0){
            //Test if can wonder west
            if(!this.attemptLotTransition( -1, 0)){
                this.goalLotPos.x =  this.lotPos.x;
            }
        }
        if(this.goalLotPos.x > 4){
            //Test if can wonder west
            if(!this.attemptLotTransition( 1, 0)){
                this.goalLotPos.x =  this.lotPos.x;
            }
        }
        if(this.goalLotPos.y < 0){
            //Test if can wonder west
            if(!this.attemptLotTransition( 0, -1)){
                this.goalLotPos.y =  this.lotPos.y;
            }
        }
        if(this.goalLotPos.y > 4){
            //Test if can wonder west
            if(!this.attemptLotTransition( 0, 1)){
                this.goalLotPos.y =  this.lotPos.y;
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
        this.awake = false;
    }
    destroy(){
        this.sprite.destroy();
    }
    getGlobalPos(){
        return {
            x: this.lot.x + ( this.lotPos.x / 4),
            y: this.lot.y + (this.lotPos.y / 4)
        }
    }
    distTo(npc){
        let myPos = this.getGlobalPos();
        let theirPos = npc.getGlobalPos();
        let xDist = myPos.x - theirPos.x;;
        let yDist =  myPos.y - theirPos.y;
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
    vecTo(npc){
        let myPos = this.getGlobalPos();
        let theirPos = npc.getGlobalPos();
        return {
            x: theirPos.x - myPos.x ,
            y: theirPos.y -  myPos.y
        }
    }
    normalizedVectorTo(npc){
        let vec = this.vecTo(npc);
        let nVec = {};
        if(vec.x > 0){
            nVec.x = 1;
        }else if(vec.x < 0){
            nVec.x = -1;
        }else{
            nVec.x = 0;
        }


        if(vec.y > 0){
            nVec.y = 1;
        }else if(vec.y < 0){
            nVec.y = -1;
        }else{
            nVec.y = 0;
        }
        return nVec;
    }
    isDead(){
        return !this.isAlive;
    }

}
export default NPC;