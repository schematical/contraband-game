import NPCHuntBehavior from "./NPCHuntBehavior";
import NPC from "../npc";
import NPCWonderBehavior from "./NPCWonderBehavior";
import NPCAttackBehavior from "./NPCAttackBehavior";
import NPCTaskBehavior from "./NPCTaskBehavior";

class NPCAIManager{
    setupZombie(npc){
        npc.addAIBehavior(new NPCAttackBehavior({
            priority: 10,
            filter:function(potentialTarget){
                return (potentialTarget.type === NPC.Type.HUMAN);
            }
        }));
        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:function(potentialTarget){
                return (potentialTarget.type === NPC.Type.HUMAN);
            }
        }));
        npc.addAIBehavior(new NPCWonderBehavior({
            priority: 50
        }));
    }
    setupCivilian(npc){
        npc.addAIBehavior(new NPCHuntBehavior({
            priority: 20,
            filter:function(potentialTarget){
                return (potentialTarget.type === NPC.Type.ZOMBIE);
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