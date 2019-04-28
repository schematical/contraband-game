import _ from 'underscore';
import NPC from "../npc";
import NPCBehavior from "./NPCBehavior";
class NPCTaskBehavior extends NPCBehavior{


    constructor(data){
        super(data);



    }
    shouldExecute(){

        if(!this.npc.getCurrentTask()){
            return false;
        }
        console.log("SHOULD EXICUTE");
        return true;

    }
    continueExecuting(){
        console.log("CONTINUE EXICUTEING");
        if(!this.npc.getCurrentTask()){
            return false;
        }
        return true;
    }
    execute(){
        this.state = this.npc.getCurrentTask().state;

        this.npc.getCurrentTask().execute()
    }

}
export default NPCTaskBehavior;