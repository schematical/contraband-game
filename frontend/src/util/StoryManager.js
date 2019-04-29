import _ from "underscore";
import NPC from "../model/npc";
import Building from "../model/building";

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
        console.log("Starting Missino Part: " + this.missionPartIndex );
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
        let mission = new Mission({
            _lock_lot: true,
            namespace:"mission1",
            canEnterLot:(npc, lot)=>{
                if(npc.type == NPC.Type.ZOMBIE){
                    return false;
                }
                if(npc.type == NPC.Type.HUMAN && !npc.faction){
                    return false;
                }
                /*if(
                    lot.x != 0 &&
                    lot.y != 0
                ){
                    return false;
                }
                return true;*/
                return true;
            },
            missionParts:[
                {
                    _done: false,
                    onStart:()=>{

                        this.app.addAlert({
                            text:"Your friends and you wait in a parking lot for your ride to arrive. " +
                                "As you wait you wonder how you all managed to dress in matching light blue shirts that, from a distance, make you look like square blocks. " +
                                "Then suddenly you notice something off in the distance..."
                        })
                        this.app.zoom(150)
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
                            lot: this.factionNPCs[0].lot,
                            mission: mission
                        });

                        this.app.aiManager.setupZombie( this.zombieNpc );
                        this.factionNPCs[0].lot.addNPC( this.zombieNpc );
                        this.zombieNpc.lotPos = {
                            x:2,
                            y:3.5
                        };
                        this.app.addNPCVisible(this.zombieNpc);
                        this.zombieNpc._stats["schematical:npc_stats:health"] = 30;
                        this.factionNPCs[0].lot.render(this.app.pixicontainer);
                        this._done = false;

                    },
                    dialogEvent: "mission1b",
                    isDone:()=>{
                        let hasDamage = false;
                        this.factionNPCs.forEach((npc)=>{
                            if(npc.stats.health < 100){
                                hasDamage = true;
                            }
                        })
                        return hasDamage;
                    }
                },
                {
                    onStart:()=>{
                        this.app.addAlert({
                            text:"The stranger starts wildly clawing and biting at you and your friends. You are forced to defend your selves. With every strike you land red blocks of pixelated blood spew from the creatures face "
                        })
                    },
                    dialogEvent: "mission1c",
                    isDone:()=>{
                        return this.zombieNpc.isDead();
                    }
                },
                {
                    onStart:()=>{
                        this._lock_lot = false;
                        this.app.addAlert({
                            text:"The 4 of you over power the stranger knocking them to the ground. When the strangers head hits the pavement with a thud it bursts open spilling the contents in side. " +
                                "In the distance you hear more moaning and the faint green block-ish outline of more creatures like this. " +
                                "It's probably a good idea to seek shelter. " +
                                "<Click on the lot next to you and in the menu in the upper left corner menu select `Explore`>"
                        })
                    },
                    dialogEvent: "mission1d",
                    isDone:()=>{
                        let hasTraveled = false;
                        this.factionNPCs.forEach((npc)=>{
                            if(
                                npc.lot.x != 0 ||
                                npc.lot.y != 0
                            ){
                                hasTraveled = true;
                            }
                        })
                        return hasTraveled;
                    }
                },
                {
                    onStart:()=>{
                        this.app.addAlert({
                            text:"You have successfully walked about 30 feet... congrats, way to go Forest Gump." +
                                "You see a suspiciously blocky building that looks like something that was designed for a low budget indie hackathon game but is definitely a building that can provide shelter. " +
                                "<In the top left menu select the building and click `Enter`>"
                        })
                    },
                    dialogEvent: "mission1d",
                    isDone:()=>{
                        let hasBuilding = false;
                        this.factionNPCs.forEach((npc)=>{
                            if(
                                npc.cover
                            ){
                                hasBuilding = true;
                            }
                        })
                        return hasBuilding;
                    }
                },
                {
                    onStart:()=>{
                        this.app.addAlert({
                            text:"You enter the building successfully taking shelter. " +
                                "You should mark this building as your HQ by selecting the building and clicking `Assign` in the upper left hand menu "
                            })
                    },
                    dialogEvent: "mission1e",
                    isDone:()=>{
                        let hasBuildingAssignment = false;
                        this.factionNPCs.forEach((npc)=>{
                            if(
                                npc.cover &&
                                npc.cover.getFactionLotState(npc.faction, Building.States.ASSIGNMENT)
                            ){
                                hasBuildingAssignment = true;
                            }
                        })
                        return hasBuildingAssignment;
                    }


                },

                {
                    onStart:()=>{
                        this.app.addAlert({
                            text: "Having staring contests and telling grossly exaggerated stories about your love life gets boring pretty quick. " +
                                "You see someone outside. They definitely are NOT the undead, "+
                                "you know this because of the style of thier grey blocky shirt (grey and blocky are all the rage with the living kids)" +
                                "You should go outside and see if they want to join your group " +
                                "<To exit the building select the building and click `Evacuate`>"
                        })

                        this.civilianNpc = this.app.addNPC({

                            type: NPC.Type.HUMAN,
                            faction: null,
                            lot: this.factionNPCs[0].lot,
                            mission: mission
                        });

                        this.app.aiManager.setupCivilian( this.civilianNpc );
                        this.factionNPCs[0].lot.addNPC( this.civilianNpc );
                        this.civilianNpc.lotPos = {
                            x:2,
                            y:3.5
                        };
                        this.app.addNPCVisible(this.civilianNpc);

                        this.factionNPCs[0].lot.render(this.app.pixicontainer);
                    },
                    dialogEvent: "mission1f",
                    isDone:()=>{
                        if(!this.civilianNpc.faction){
                            return false;
                        }
                        return true;
                    }


                },
                {
                    onStart:()=>{
                        this.app.addAlert({
                            text: "Looks like you made a new friend. Congrats! " +
                                "In reality this is as far as this demo is at the moment. So hop on the Schematical discord [https://discord.gg/j9P8AcR] and let me know what you think ~Schematical"

                        })

                        this.civilianNpc = this.app.addNPC({

                            type: NPC.Type.HUMAN,
                            faction: null,
                            lot: this.factionNPCs[0].lot,
                            mission: mission
                        });

                        this.app.aiManager.setupCivilian( this.civilianNpc );
                        this.factionNPCs[0].lot.addNPC( this.civilianNpc );
                        this.civilianNpc.lotPos = {
                            x:2,
                            y:3.5
                        };
                        this.app.addNPCVisible(this.civilianNpc);

                        this.factionNPCs[0].lot.render(this.app.pixicontainer);
                    },
                    dialogEvent: "mission1g",
                    isDone:()=>{

                        return false;
                    }


                },
                //"You start to feel thirsty and realize you soon will need food and water. It is time to start foraging for food. " +



            ]

        });
        this.addMission(mission);

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