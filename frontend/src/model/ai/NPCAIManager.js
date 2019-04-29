import NPCHuntBehavior from "./NPCHuntBehavior";
import NPC from "../npc";
import NPCWonderBehavior from "./NPCWonderBehavior";
import NPCInteractBehavior from "./NPCInteractBehavior";
import NPCTaskBehavior from "./NPCTaskBehavior";

class NPCAIManager{
    filterCivilian(potentialTarget){
        if(potentialTarget.type !== NPC.Type.HUMAN){
            return false;
        }
        if(potentialTarget.faction){
            return false;
        }
        if(potentialTarget.isDead()){
            return false;
        }
        if(potentialTarget.cover){
            return false;
        }
        if(potentialTarget._recruit_denied){
            return false;
        }
        return true;
    }
    filterZombie(potentialTarget){
        if(potentialTarget.type !== NPC.Type.ZOMBIE){
            return false;
        }
        if(potentialTarget.isDead()){
            return false;
        }
        if(potentialTarget.cover){
            return false;
        }
        return true;
    }
    setupZombie(npc){
        function filterHumanNotInCover(potentialTarget){

            if(potentialTarget.type !== NPC.Type.HUMAN){
                return false;
            }
            if(potentialTarget.cover) {
                return false;
            }

            return true;
        }
        npc.addAIBehavior(new NPCInteractBehavior({
            priority: 10,
            filter:filterHumanNotInCover,
            interact:function(target){
                this.state = "Attacking";
                this.npc.attackNPC(target);
            }
        }));
        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:filterHumanNotInCover
        }));
        npc.addAIBehavior(new NPCWonderBehavior({
            priority: 50
        }));
    }
    setupCivilian(npc){


        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:this.filterZombie,
            shouldFlee:function(target){
                this.state = NPCHuntBehavior.States.Fleeing;
                return true;
            }
        }));
        npc.addAIBehavior(new NPCWonderBehavior({
            priority: 50
        }));
    }
    setupFactionMember(npc){
        npc.addAIBehavior(new NPCInteractBehavior({
            priority: 10,
            filter:this.filterZombie,
            interact:function(target){
                this.state = "Attacking";
                this.npc.attackNPC(target);
            }
        }));
        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:this.filterZombie
        }));
        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:this.filterCivilian
        }));
        npc.addAIBehavior(new NPCInteractBehavior({
            priority: 10,
            filter:this.filterCivilian,
            interact:function(target){
                this.state = "Recruiting";
                target.app.gui.npcRecruitComponent.show({
                    npc: target
                })
            }
        }));
        npc.addAIBehavior(new NPCTaskBehavior({
            priority: 20
        }));
        npc.addAIBehavior(new NPCWonderBehavior({
            priority: 50
        }));
    }

}
export default NPCAIManager;