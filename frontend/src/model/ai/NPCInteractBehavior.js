import _ from 'underscore';
import NPC from "../npc";
import NPCBehavior from "./NPCBehavior";
class NPCInteractBehavior extends NPCBehavior{
    static States(){
        return {
            "Wondering":"Wondering"
        }
    }

    constructor(data){
        super(data);



    }
    shouldExecute(){
        //Find a target

        let targets = [];
        this.npc.lot.npcs.forEach((npc)=>{

            if(npc.cover){
                return;
            }

            if(!this.filter(npc)){
                return;
            }

            targets.push({
                npc:npc,
                dist: this.npc.distTo(npc)
            });
        })

        if(targets.length == 0){
            return false;
        }

        targets = _.sortBy(targets, (targetInfo)=>{
            return targetInfo.dist;
        })

        if(targets[0].dist > .1){//TODO: Add in attack range
            return false;
        }

        this.target = targets[0].npc;

        return true;

    }
    continueExecuting(){
        return false;
    }
    execute(){
        this.interact(this.target);


    }

}
export default NPCInteractBehavior;