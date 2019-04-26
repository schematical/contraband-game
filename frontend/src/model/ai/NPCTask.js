import _ from 'underscore';
import NPC from "./npc";
class NPCTask{
    constructor(data){

        _.extend(this, data);


    }
    populateNPCs(){
        this.npcs = [];

        let npcChance = Math.floor((this.lot.app.rnd() * 25) - 20);

        for(let i = (npcChance); i > 0; i -= 1){
            this.npcs.push(
                this.lot.app.addNPC({
                    type: NPC.Type.HUMAN,
                    faction: null,//CIVILIAN ??,
                    lot: this.lot
                })
            )
        }



    }

}
export default NPCTask;