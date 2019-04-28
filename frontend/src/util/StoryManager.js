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
                            this.app.pixicontainer.snapZoom({
                                width: 128,
                                height: 128
                            });
                            this.app.addCountDown(10000, ()=>{
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

                        },
                        dialogEvent: "mission1c",
                        isDone:()=>{
                            return this.zombieNpc.isDead();
                        }
                    },
                    {
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