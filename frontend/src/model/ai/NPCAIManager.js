import NPCHuntBehavior from "./NPCHuntBehavior";
import NPC from "../npc";
import NPCWonderBehavior from "./NPCWonderBehavior";
import NPCAttackBehavior from "./NPCAttackBehavior";
import NPCTaskBehavior from "./NPCTaskBehavior";

class NPCAIManager{
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
        npc.addAIBehavior(new NPCAttackBehavior({
            priority: 10,
            filter:filterHumanNotInCover
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
            filter:function(potentialTarget){
                if(potentialTarget.type !== NPC.Type.ZOMBIE){
                    return false;
                }
                if(potentialTarget.cover){
                    return false;
                }
                return true;
            },
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
        npc.addAIBehavior(new NPCTaskBehavior({
            priority: 20
        }));
        npc.addAIBehavior(new NPCWonderBehavior({
            priority: 50
        }));
    }
}
export default NPCAIManager;