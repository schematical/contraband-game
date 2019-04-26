import _ from 'underscore';
import NPC from "../npc";
import NPCBehavior from "./NPCBehavior";
class NPCWonderBehavior extends NPCBehavior{
    constructor(data){
        super(data);



    }
    shouldExecute(){

        return true;

    }
    continueExecuting(){
        return false;
    }
    execute(){

        if(!this.npc.sprite){
            return;
        }
        if(
            !this.npc.velocity ||
            Math.round(this.npc.app.rnd() * 20) == 1
        ){
            this.npc.changeVelocity();
        }

    }

}
export default NPCWonderBehavior;