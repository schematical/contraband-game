import _ from 'underscore';
import NPC from "./npc";
import NPCWonderBehavior from "./ai/NPCWonderBehavior";
import ResourceInstance from "./ResourceInstance";
class Building{
    static buildingIdCounter = 0;
    static get States(){
        return {
            EXPLORED:"EXPLORED",
            ALLOWED:"ALLOWED",
            ASSIGNMENT:"ASSIGNMENT",
            OCCUPIED:"OCCUPIED"
        }
    }
    constructor(data){
        this.capacity = 1;
        this.tiles = [];
        this.resources = [];
        this.factionLotStates = {};
        _.extend(this, data);
        this.ingressTiles = [];
        this.id = "building_" + Building.buildingIdCounter++;

    }
    addTile(tile){
        tile.building = this;
        this.tiles.push(tile);

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
        /*Object.keys(Building.States).forEach((state)=>{
            switch(state){
                case(Building.States.OBSERVED):
                case(Building.States.OCCUPIED):
                    this.factionLotStates[faction.namespace][state] = false;

            }
        })*/
    }
    populateResources(){
        let npcChance = Math.floor((this.lot.app.rnd() * 25) - 20);
        for(let i = (npcChance); i > 0; i -= 1){
            let resourceReg = this.app.registry.resources.rnd();
            let resourceInstance = new ResourceInstance({
                reg: resourceReg,
                count: this.app.registry.resources.range(resourceReg, "spawnCount", 1)
            })
            this.resources.push(resourceInstance);

        }

    }
    populateNPCs(){
        this.npcs = [];

        let npcChance = Math.floor((this.lot.app.rnd() * 25) - 20);
        let types = [NPC.Type.HUMAN, NPC.Type.ZOMBIE];
        let type = types[Math.floor(this.lot.app.rnd() * types.length)];
        for(let i = (npcChance); i > 0; i -= 1){

             let npc = this.lot.app.addNPC({
                type: type,
                faction: null,
                lot: this.lot
            });
             switch(type){
                 case(NPC.Type.HUMAN):
                     npc.app.aiManager.setupCivilian(npc);
                 break;
                 case(NPC.Type.ZOMBIE):
                     npc.app.aiManager.setupZombie(npc);
                 break;
             }
            npc.cover = this;
            this.npcs.push(npc);
        }



    }
    tickSimple(){
        this.npcs.forEach((npc)=>{
            npc.tickSimple();
        })
    }
    guiDeselect(){

    }
    guiSelect(){

    }
    removeNPC(npc){

        this.npcs = _.reject(this.npcs, (_npc)=>{
            return npc.id == _npc.id;
        })

    }

}
export default Building;