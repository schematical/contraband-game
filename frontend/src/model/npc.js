import _ from 'underscore';
import {Helper} from "../util/Helper";
import * as PIXI from "pixi.js";
import  names from '../data/names';
import Lot from "./lot";
import events from 'events';

// Create an eventEmitter object
class NPC{
    static get Type(){
        return {
            ZOMBIE: "ZOMBIE",
            HUMAN: "HUMAN",
            RECENTLY_DECEASED: "RECENTLY_DECEASED"
        }
    }

    constructor(data){
        this.traits = [];
        this._stats = {};
        this.behaviors = [];
        this.awake = true;
        this.alive = true;
        this.tasks = [];
        this.interactions = [];



        _.extend(this, data);
        this.eventEmitter = new events.EventEmitter();

        this.populateStats();


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
    addInteraction(interaction){
        this.interactions.push(interaction);
    }
    addAIBehavior(behavior){
        behavior.npc = this;
        this.behaviors.push(behavior);
        this.behaviors = _.sortBy(this.behaviors, (behavior)=>{
            return behavior.priority;
        })
    }
    clearAIBehaviors(){
        this.behaviors = [];
    }
    populateStats( _options){
        let options = {
            type:"basic"
        };
        _.extend(options, _options)
        //Iterate through all stats
        let stats = this.app.registry.npc_stats.list();
        this.stats = {};
        let _this = this;
        let shortKeys = [];
        Object.keys(stats).forEach((namespace)=>{
            if(!_.isUndefined(this._stats[namespace])){
                return;
            }
            if(
                !(
                    options.type == "*" ||
                    stats[namespace].type == options.type
                )
            ){
                return;
            }
            this._stats[namespace] = this.app.registry.range(stats[namespace], "startRange", stats[namespace].startValue);

            shortKeys.push(stats[namespace].shortNamespace);
            Object.defineProperty( this.stats, stats[namespace].shortNamespace, {
                get: function() {
                    console.log("GETTING: ", stats[namespace].shortNamespace, namespace, _this._stats[namespace]);
                    return _this._stats[namespace];
                }
            });
        })
        this.stats.getKeys = ()=>{
            return shortKeys;
        }
    }
    populateRandom(){

        this.name = names[Math.floor(Math.random() * names.length)] += " ";
        this.name += names[Math.floor(Math.random() * names.length)].substr(0,1) + '.';
        this.occupation  = this.app.registry.occupations.rnd();

    }
    render(container, _options){
        let options = {
            refresh: false
        };
        _.extend(options, _options);


        let texture = null;

        switch(this.type){
            case(NPC.Type.RECENTLY_DECEASED):
                texture = this.lot.app.textureManager.getNPCRecentlyDeceasedObservedDefault();
            break;
            case(NPC.Type.ZOMBIE):
                if(this.stats.health > 0) {
                    texture = this.lot.app.textureManager.getNPCZombieObservedDefault();
                }else {
                    texture = this.lot.app.textureManager.getNPCZombieObservedDowned();
                }
            break;
            case(NPC.Type.HUMAN):
                if(this.faction) {//TODO: Check if its the players faction

                    texture = this.lot.app.textureManager.getNPCAllieObservedDefault();

                }else{
                    texture = this.lot.app.textureManager.getNPCCivilianObservedDefault();
                }
            break;
            default:
                throw new Error("Invalid `npc.type`: " + this.type);


        }
        if( options.refresh){
            //TODO: Delete the sprite
            this.sprite = null;
        }
        if(
            !this.sprite
        ) {
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
            this.sprite.on('pointerover', _.bind(this.onPointerOver, this));
            this.sprite.on('pointerout', _.bind(this.onPointerOut, this))
        }else{
            this.sprite.texture = texture;
        }

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
        if (this.faction && this.type == NPC.Type.HUMAN) {//<--- Zombies dont follow the rules
            if(!destLot.getFactionLotState(this.faction, Lot.States.ALLOWED)){
                return false;
            }

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
            if(this.faction) {
                this.app.refreshFactionLotStates();
                destLot.setFactionLotState(this.faction, Lot.States.EXPLORED, true);
            }
            this.app.map.render( this.app.pixicontainer );
            return true;
        }

    }
    attackNPC(target){
        target.addInteraction({
            type:"attack",
            damage: 50,
            attacker: this
        })
        this.rndCaptionFromCollection("attack_give");

    }
    tickBiology(deltaMS){

        //Cause hunger
        //check damage
        if(!this.alive){
            return;
        }
        this.interactions.forEach((interaction)=>{
            switch(interaction.type){
                case("attack")://TODO: Enum
                    this._stats["schematical:npc_stats:health"] -= interaction.damage;//TODO: Apply defence and armor and stuff
                    this.rndCaptionFromCollection("attack_receive");

                    break;
                default:
                    throw new Error("Invalid `interaction.type`: " + interaction);
            }
        })
        this.interactions = [];

        //Check resulting stats
        //Check if dead:

        if(this._stats["schematical:npc_stats:health"] <= 0){
            switch(this.type) {
                case(NPC.Type.HUMAN):
                    this.type = NPC.Type.RECENTLY_DECEASED;
                    this.app.addCountDown(
                        10000,
                        () => {
                            this._stats["schematical:npc_stats:health"] = 100;
                            this.type = NPC.Type.ZOMBIE;
                            this.faction = null;
                            this.clearAIBehaviors();
                            this.app.aiManager.setupZombie(this);
                            this.render();
                            this.setCaption(this.app.dialogManager.getEventChat("zombie_moan").text);
                        }
                    );


                break;
                case(NPC.Type.ZOMBIE):
                    this.app.addCountDown(
                        5000,
                        () => {
                            this.sleep();
                            this.destroy();
                        }
                    );
                break;
            }
            this.velocity = {
                x: 0,
                y: 0
            }
            this.render();
            this.alive = false;

        }


    }
    tickAI(){
        if(this.type == NPC.Type.RECENTLY_DECEASED){
            return;
        }
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
        if(!this.sprite){
            return;
        }
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
        if(!this.lotPos){
            console.error(this);
            throw new Error("Cant call this on an NPC with an empty `lotPos`");
        }
        return {
            x: this.lot.x + (this.lotPos.x / 4),
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
        return !this.alive;
    }

    setCaption(text){


        if(!this.captionSprite) {
            const richText = new PIXI.Text(
                text,
                this.app.textureManager.getTextStyle()
            );
            richText.x = 0;
            richText.y = -10;
            this.captionSprite = richText;
            this.sprite.addChild( this.captionSprite);
        }else{
            this.captionSprite.text = text;
        }
        this.app.addCountDown(3000, ()=>{
            this.captionSprite.text = "";
        })


    }
    rndCaptionFromCollection(event){
        if(this.app.rnd() * 5 > 1){
            return;
        }
        this.setCaption(this.app.dialogManager.getEventChat(event).text);
    }


}
export default NPC;