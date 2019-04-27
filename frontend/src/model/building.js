import _ from 'underscore';
import NPC from "./npc";
import NPCWonderBehavior from "./ai/NPCWonderBehavior";
class Building{
    constructor(data){

        _.extend(this, data);


    }
    populateNPCs(){
        this.npcs = [];

        let npcChance = Math.floor((this.lot.app.rnd() * 25) - 20);

        for(let i = (npcChance); i > 0; i -= 1){

             let npc = this.lot.app.addNPC({
                type: NPC.Type.HUMAN,
                faction: null,//CIVILIAN ??,
                lot: this.lot
            });
            npc.addAIBehavior(new NPCWonderBehavior({
                priority: 50
            }));
            this.npcs.push(npc);
        }



    }
    guiDeselect(){

    }
    guiSelect(){

    }

}
export default Building;