import _ from 'underscore';

import NPCBehavior from "./NPCBehavior";
class NPCHuntBehavior extends NPCBehavior{
    constructor(data){
        super(data);

        if(_.isUndefined(this.filter)){
            throw new Error("Must have a `filter` to hunt");
        }
        this.filter = this.filter.bind(this);

    }
    shouldExecute(){
        //Find a target
        let targets = [];
        this.npc.lot.npcs.forEach((npc)=>{
            if(this.filter(npc)){
                return;
            }
            targets.push(npc);
        })
        if(targets.length == 0){
            return false;
        }
        if(targets.length > 1){
            targets = _.sortBy(targets, (target)=>{
                return this.npc.distTo(target);
            })
        }
        this.target = targets[0];
        return true;

    }
    continueExecuting(){
        return true;
    }
    execute(){
        let nVec = this.npc.normalizedVectorTo(this.target);
        this.npc.velocity = {
            x: nVec.x,
            y: nVec.y
        }
    }

}
export default NPCHuntBehavior;