import _ from 'underscore';

import NPCBehavior from "./NPCBehavior";
class NPCHuntBehavior extends NPCBehavior{
    static get States(){
        return {
            "Hunting": "Hunting",
            "Fleeing": "Fleeing"
        }

    }
    constructor(data){
        super(data);

        if(_.isUndefined(this.filter)){
            throw new Error("Must have a `filter` to hunt");
        }
        this.filter = this.filter.bind(this);
        if(!_.isUndefined(this.shouldFlee)) {
            this.shouldFlee = this.shouldFlee.bind(this);
        }

    }

    shouldExecute(){

        //Find a target
        let targets = [];
        this.npc.lot.npcs.forEach((npc)=>{
            if(this.npc.cover){
                return;
            }
            if(!this.filter(npc)){
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
        if(!this.target){
            return false;
        }
        if(this.target.isDead()){
            this.target = null;
            return false;
        }
        if(!this.target.awake){
            this.target = null;
            return false;
        }
        return true;
    }
    execute(){
        this.state = NPCHuntBehavior.States.Hunting;
        let nVec = this.npc.normalizedVectorTo(this.target);
        if(this.shouldFlee && this.shouldFlee(this.target)){
            nVec.x *= -1;
            nVec.y *= -1;
        }

        this.npc.velocity = {
            x: nVec.x,
            y: nVec.y
        }
    }

}
export default NPCHuntBehavior;