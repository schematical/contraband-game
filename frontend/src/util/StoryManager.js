import _ from "underscore";
import NPC from "../model/npc";

class Mission{
    constructor(data){
        this.missionPartIndex = 0;
        this.missionParts = [];
        _.extend(this, data);
        if(this.missionParts.length == 0){
            throw new Error("Invalid Mission");
        }
        this.missionParts.forEach((missionPart)=> {
            if (_.isUndefined(missionPart.isDone)) {
                throw new Error("Invalid MissionPart. Needs `isDone`")
            }
        })

    }
    getCurrMissionPart(){
        return this.missionParts[this.missionPartIndex];
    }
    start(){
        let missionPart = this.getCurrMissionPart();
        if(missionPart._started){
            throw new Error("Mission part already stated");
        }

        if(!_.isUndefined(missionPart.onStart)){
            missionPart.onStart();
        }
        missionPart._started = true;
    }
    nextMissionPart(){
        this.missionPartIndex += 1;
        if(this.missionPartIndex >= this.missionParts.length){
            //End mission
            console.log("MISSION OVER");
            return;
        }
        let missionPart = this.getCurrMissionPart();
        if(!_.isUndefined(missionPart.onStart)){
            missionPart.onStart();
        }

    }
    tick(){
        let missionPart = this.getCurrMissionPart();

        if(missionPart.isDone()){
            this.nextMissionPart();
        }

        //Do dialog
        if(missionPart.dialogEvent) {
            if (this.app.rnd() * 10 < 3) {
                let speakerNPC = this.storyManager.factionNPCs[Math.floor(this.app.rnd() * this.storyManager.factionNPCs.length)];
                speakerNPC.setCaption(this.app.dialogManager.getEventChat(missionPart.dialogEvent).text)
            }
        }

    }


}
class StoryManager{

    constructor(data){
        this.missions = [];
        this.currMission = null;
        _.extend(this, data);

        this.addMission(
            new Mission({
                namespace:"mission1",
                missionParts:[
                    {
                        _done: false,
                        onStart:()=>{
                            this.app.addAlert({
                                text:"Your friends and you wait in a parking lot for your ride to arrive. " +
                                    "As you wait you wonder how you all managed to dress in matching light blue shirts that, from a distance, make you look like square blocks." +
                                    "Then suddenly you notice something off in the distance..."
                            })
                           this.app.zoom(128)
                            this.app.addCountDown(20000, ()=>{
                                this._done = true;

                            })
                        },
                        dialogEvent: "mission1a",
                        isDone:()=>{

                            return this._done;
                        }
                    },
                    {
                        _done: false,
                        onStart:()=>{
                            this.app.addAlert({
                                text:"The person in the shadows steps forward making a gowning noise. " +
                                    "All color has gone from their skin causing it to appear to anyone looking down on them from an arial view as greenish blob(which also happens to be a square) "  +
                                    "As they approach you start to feel the hairs on your neck stand up.."
                            })
                            this.zombieNpc = this.app.addNPC({

                                type: NPC.Type.ZOMBIE,
                                faction: null,
                                lot: this.factionNPCs[0].lot
                            });

                            this.app.aiManager.setupZombie( this.zombieNpc );
                            this.factionNPCs[0].lot.addNPC( this.zombieNpc );
                            this.zombieNpc.lotPos = {
                                x:2,
                                y:3.5
                            };
                            this.app.addNPCVisible(this.zombieNpc);
                            this.factionNPCs[0].lot.render(this.app.pixicontainer);
                            this._done = false;
                            this.app.addCountDown(10000, ()=>{
                                this._done = true;

                            })
                        },
                        dialogEvent: "mission1b",
                        isDone:()=>{
                            return this._done;
                        }
                    },
                    {
                        onStart:()=>{
                            this.app.addAlert({
                                text:"The stranger  starts wildly clawing and biting at you and your friends. You are forced to defend your selves."
                            })
                        },
                        dialogEvent: "mission1c",
                        isDone:()=>{
                            return this.zombieNpc.isDead();
                        }
                    },
                    {
                        onStart:()=>{
                            this.app.addAlert({
                                text:"The 4 of you over power the stranger knocking them to the ground. When the strangers head hits the pavement with a thud it bursts open spilling the contents in side." +
                                    "In the distance you hear more moaning and the faint green blockish outline of more creatures like this." +
                                    "It's probably a good idea to seek shelter"
                            })
                        },
                        dialogEvent: "mission1d",
                        isDone:()=>{
                            return false;
                        }
                    }
                ]

            })
        )
    }
    addMission(mission){
        mission.app = this.app;
        mission.storyManager = this;
        this.missions.push(mission);
    }
    tick(){
        if(!this.currMission){
            return;
        }
        this.currMission.tick()

    }
    start(namespace){
        this.factionNPCs = [];
        this.app.visibleNPCs.forEach((npc)=>{
            if(npc.faction && npc.faction.namespace == this.app.playerFaction.namespace){
                this.factionNPCs.push(npc);
            }
        })

        this.currMission = null;
        this.missions.forEach((mission)=>{
            if(mission.namespace == namespace){
                this.currMission = mission;
            }
        })
        if(_.isNull(this.currMission)){
            throw new Error("Could not find mission with `namespace`: " + namespace);
        }
        this.currMission.start();

        console.log("Started Mission: " + namespace);

    }


}
export default StoryManager;