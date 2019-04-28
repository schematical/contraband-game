import _ from 'underscore';
import NPC from "./npc";
import NPCWonderBehavior from "./ai/NPCWonderBehavior";
class Building{
    constructor(data){
        this.capacity = 1;
        this.tiles = [];
        _.extend(this, data);
        this.ingressTiles = [];


    }
    addTile(tile){
        tile.building = this;
        this.tiles.push(tile);

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