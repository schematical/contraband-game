import _ from 'underscore';

import NPCTask from "./NPCTask";
class NPCMoveTask extends NPCTask{
    state = "Move";
    constructor(data){
        super(data);


        if(!this.lot){
            throw new Error("Need a `lot` parameter");
        }
        //TODO: Allow it to take a building too

    }
    execute(){
        if(
            this.npc.cover
        ){
            console.log("ATTEMPTING EGRESS")
            this.npc.attemptEgress()
            return;
        }
        if(
            this.npc.lot.x != this.lot.x ||
            this.npc.lot.y != this.lot.y
        ){
            let nVec = this.npc.lot.normalizedVectorTo(this.lot);
            this.npc.velocity = {
                x: nVec.x,
                y: nVec.y
            }
            return;
        }

        if(
            this.building
        ){


            if(!this.npc.attemptIngress(this.building)){
                console.log("Ingress failed");
                let nVec = this.npc.normalizedVectorTo(this.building.ingressTiles[0]);
                this.npc.velocity = {
                    x: nVec.x,
                    y: nVec.y
                }
                return;
            }
            console.log("Ingress successful")
        }


        //Set this finished
        console.log("Completed: " +this.npc.lot.x + "!=" + this.lot.x + " && " +
        this.npc.lot.y + " != " +this.lot.y);
        this.markCompleted();
    }


}
export default NPCMoveTask;