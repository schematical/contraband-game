import Building from './building';
import Tile from './tile';
import * as PIXI from 'pixi.js';
import Material from "./material";
import NPC from "./npc";
import {Helper} from "../util/Helper";
import _ from "underscore";
import NPCHuntBehavior from "./ai/NPCHuntBehavior";
import NPCWonderBehavior from "./ai/NPCWonderBehavior";
import NPCAttackBehavior from "./ai/NPCAttackBehavior";
class Lot{
    static get States(){
        return {
            OBSERVED: "OBSERVED",
            ALLOWED: "ALLOWED",
            EXPLORED: "EXPLORED",
            OCCUPIED: "OCCUPIED",
            MAPPED: "MAPPED"
        }
    }
    static get Direction(){
        return {
            UP: "UP",
            DOWN: "DOWN",
            WEST: "WEST",
            EAST: "EAST"
        }
    }
    constructor(data){

        this.cols = [];
        this.buildings = [];
        this.npcs = [];
        this.factionLotStates = {};
        _.extend(this, data);

    }
    get(x,y){
        if(!this.cols[x]){
            this.cols[x] = [];
        }
        let tile = this.cols[x][y] || null;

        return tile;
    }
    getFactionLotState(faction, state){
        this.factionLotStates[faction.namespace] = this.factionLotStates[faction.namespace] || {};
        return this.factionLotStates[faction.namespace][state] || false;
    }
    setFactionLotState(faction, state, value){
        this.factionLotStates[faction.namespace] = this.factionLotStates[faction.namespace] || {};
        this.factionLotStates[faction.namespace][state] = value;
    }
    resetFactionLotStates(faction){
        //Just reset Observed for now
        this.factionLotStates[faction.namespace] = this.factionLotStates[faction.namespace] || {};
        Object.keys(Lot.States).forEach((state)=>{
            switch(state){
                case(Lot.States.OBSERVED):
                case(Lot.States.OCCUPIED):
                    this.factionLotStates[faction.namespace][state] = false;

            }
        })
    }
    getGlobalPos(){
        return {
            x: this.x,
            y: this.y
        }
    }
    populateRandom(){
        this.populateRandomBuilding();



        this.cacheEmptyTiles();

        this.populateNPCs();




    }
    cacheEmptyTiles(){
        this.emptyTileCoords = [];
        for(let x = 0; x < 4; x++){
            for(let y = 0; y < 4; y++){
                let tile = this.getTile(x,y);
                if(!tile){
                    this.emptyTileCoords.push({
                        x:x,
                        y:y
                    })
                }
            }
        }
    }
    populateNPCs(){
        this.npcs = [];
        if(this.emptyTileCoords.length == 0){
            return;
        }

        let zombieNpcChance = Math.floor((this.app.rnd() * 10) - 5);

        for(let i = (zombieNpcChance); i > 0; i -= 1){
            let npc = this.app.addNPC({

                type: NPC.Type.ZOMBIE,
                faction: null,//CIVILIAN ??,
                lot: this
            });

            this.app.aiManager.setupZombie(npc);
            this.addNPC(npc);
        }

        let npcChance = Math.floor((this.app.rnd() * 25) - 20);

        for(let i = (npcChance); i > 0; i -= 1){


             let npc = this.app.addNPC({
                type: NPC.Type.HUMAN,
                faction: null,//CIVILIAN ??,
                lot: this
            })
            this.app.aiManager.setupCivilian(npc);
            this.addNPC(
                npc
            )
        }


        this.shuffleNPCSLotPos();

    }
    addNPC(npc){
        this.npcs.push(npc);
        npc.lot = this;
    }
    shuffleNPCSLotPos(){
        let npcsToTilesRatio =  this.emptyTileCoords.length / this.npcs.length ;
        let index = 0;
        this.emptyTileCoords = _.shuffle( this.emptyTileCoords);
        _.shuffle(this.npcs).forEach((npc)=>{
            npc.lotPos = this.emptyTileCoords[Math.floor(index)];
            if(!npc.lotPos){
                throw new Error("Your math is off");
            }
            index += npcsToTilesRatio;
        });
    }
    populateRandomBuilding(){

        let _x = 0;
        let _y = 0;
        let data = this.app.registry.buildings.rnd();
        let primaryMaterialNamespace = this.app.registry.rndColl(data, "primary_materials", "schematical:material:wood");
        let secondaryMaterialNamespace = this.app.registry.rndColl(data, "secondary_materials", "schematical:material:none");
        let depth = this.app.registry.range(data, "size", 1);
        let width = this.app.registry.range(data, "size", 1);
        let startX = Math.floor(Math.random() * (4 - width));
        let startY = Math.floor(Math.random() * (4 - depth));
        let area = width * depth;
        _x += startX;
        _y += startY;

        let building = new Building({
            lot: this,
            x: _x + startX,
            y: _y + startY,
            type: data.namespace,
            capacity: area * 2,
            ingress: this.app.registry.range(data, "ingress", 1),
            egress: this.app.registry.range(data, "egress", 1),
            height: this.app.registry.range(data, "height", 1),
            primaryMaterial: new Material(
                this.app.registry.materials.get(
                    primaryMaterialNamespace
                )
            ),
            secondaryMaterial: new Material(
                this.app.registry.materials.get(
                    secondaryMaterialNamespace
                )
            ),
            fortificationMaterial: new Material(this.app.registry.materials.get("schematical:material:none"))
        });





        let bottomTiles = [];
        //Create tiles
        for(let x = _x; x < _x + width; x += 1){
            for(let y = _y; y < _y + depth; y += 1){
                let bottom = (y + 1 == _y + depth);
                let side = 0;
                if(y == _y){
                    side = -1;
                }else if(y == (y+depth - 1)){
                    side = 1;
                }
                this.cols[x] =  this.cols[x] || [];
                this.cols[x][y] = new Tile({
                    lot: this,
                    x: x,
                    y: y,
                    bottom: bottom,
                    side: side
                })
                if(bottom){
                    bottomTiles.push(this.cols[x][y]);
                }
                building.addTile(this.cols[x][y]);
            }
        }

        bottomTiles = _.shuffle(bottomTiles)

        for(let i = 0; i < building.ingress; i++){
            let tile = bottomTiles[i];
            if(!tile){
                return;//throw new Error("Your math is off");
            }
            tile.ingress = true;
            building.ingressTiles.push(tile);
        }
        building.populateNPCs();
        this.buildings.push(building);
    }
    tickSimple(){
        this.buildings.forEach((building)=>{
            building.tickSimple();
        })

        this.npcs.forEach((npc)=>{

            npc.tickSimple();

        })
    }
    render(container,  _options){
        let options = {
            refresh: false
        };
        _.extend(options, _options);

        let size = 64;
        let texture = this.app.textureManager.getLotObservedDefault();
        if(this.getFactionLotState(this.app.playerFaction, Lot.States.OBSERVED)) {
            texture = this.app.textureManager.getLotObservedDefault();
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
            this.sprite.x = this.x * (size + 8);
            this.sprite.y = this.y * (size + 8);
            this.sprite.width = size;
            this.sprite.height = size;
            container.addChild(this.sprite);
            // Opt-in to interactivity
            this.sprite.interactive = true;
            this.sprite.buttonMode = true;
            this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
            this.sprite.on('pointerover', _.bind(this.onPointerOver, this));
            this.sprite.on('pointerout', _.bind(this.onPointerOut, this))
            container.addChild(this.sprite);
        }else{
            this.sprite.texture = texture;
        }


        if(this.getFactionLotState(this.app.playerFaction, Lot.States.MAPPED)) {
            this.eachTile((tile) => {
                tile.render(this.sprite, options);//this.container);
            })
        }
        if(this.getFactionLotState(this.app.playerFaction, Lot.States.OBSERVED)) {
            this.npcs.forEach((npc) => {
                npc.render(this.sprite, options);
            });
        }

    }
    getTile(x, y){
        return this.cols[x] && this.cols[x][y] || null;
    }
    eachTile(iterator){

        this.cols.forEach((col)=>{
            col.forEach((tile)=>{
                iterator(tile);
            })
        })
    }
    onPointerDown(e){
        if(e.which === 3){

        }
        console.log("Right Click", e.data.originalEvent.which);
        this.app.selectTile(this);
    }
    onPointerOver(){
        let debugText = "LOT(" + this.x + ", " + this.y + ") - (" + this.sprite.width + ", " + this.sprite.height + ")";
        this.app.setState({text: debugText});
        let texture = this.app.textureManager.getLotObservedHovered();
        this.sprite.texture = texture;

    }
    onPointerOut(){
        if(
            this.app.state.selected_lot &&
            this.app.state.selected_lot.x == this.x &&
            this.app.state.selected_lot.y == this.y
        ){
            return;
        }
        this.app.setState({text: ""});
        let texture = this.app.textureManager.getLotObservedDefault();
        this.sprite.texture = texture;

    }

    guiDeselect(){
        if(this.getFactionLotState(this.app.playerFaction, Lot.States.OBSERVED)) {
            this.sprite.texture = this.app.textureManager.getLotObservedDefault();
        }
    }
    guiSelect(){
        if(this.getFactionLotState(this.app.playerFaction, Lot.States.OBSERVED)) {
            this.sprite.texture = this.app.textureManager.getLotObservedSelected();
        }
    }
    removeNPC(npc){

        this.npcs = _.reject(this.npcs, (_npc)=>{
            return npc.id == _npc.id;
        })

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


}
export default Lot;