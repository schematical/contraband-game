import React, { Component } from 'react';
import buildings from './data/buildings.json';
import events from './data/events.json';
import materials from './data/materials.json';
import occupations from './data/occupations.json';
import npcStats from './data/npc_stats.json';
import dialog from './data/dialog.json';
import './App.css';
import * as PIXI from 'pixi.js';
import NavBarComponent from "./components/NavBarComponent";
import HeaderComponent from "./components/HeaderComponent";
import ModRegistry from "mod-registry";
import seedrandom  from 'seedrandom';
import Map from './model/map';
import NPC from "./model/npc";
import TextureManager from "./util/TextureManager";
import Faction from "./model/faction";
import NPCDetailComponent from './components/NPCDetailComponent';
import LotDetailComponent from "./components/LotDetailComponent";
import Lot from "./model/lot";
import * as _ from "underscore";
import NPCWonderBehavior from "./model/ai/NPCWonderBehavior";
import BuildingDetailComponent from "./components/BuildingDetailComponent";
import TaskAssignmentComponent from "./components/TaskAssignmentComponent";
import ModalComponent from "./components/ModalComponent";
import NPCTaskBehavior from "./model/ai/NPCTaskBehavior";
import NPCDialogManager from "./util/NPCDialogManager";
const app = new PIXI.Application();
const Viewport = require('pixi-viewport');

class App extends Component {
    constructor(props) {
        super(props);
        this.rnd = seedrandom(Math.random());
        this.state = {
            cycleCount:0,
            ticksSinceLastCycle: 0,
            ticksSinceNPCPhysics:0,
            ticksSinceNPCAI:0,
            npcTickIndex: 0
        }
        this.setupRegistry();
        /* this.handleChange = this.handleChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);*/
        this.start = this.start.bind(this);
        this.gui = {};
        this.gui.text = "";
        this.npcs =[];
        this.textureManager = new TextureManager();
        this.dialogManager = new NPCDialogManager(this.registry.dialog.list());
        this.factions = [];
        this._npcId = 0;
        this.gui = {};
        this.tickCounters = [];


    }
    setupRegistry(){
        this.registry = new ModRegistry({
            namespace: "necropolis",
            rnd: this.rnd
        });
        let buildingReg = this.registry.add('buildings');
        buildings.forEach((data)=>{
            buildingReg.add(data.namespace, data);
        });

        let eventsReg = this.registry.add('events');
        events.forEach((data)=>{
            eventsReg.add(data.namespace, data);
        });
        let materialsReg = this.registry.add('materials');
        materials.forEach((data)=>{
            materialsReg.add(data.namespace, data);
        });
        let occupationsReg = this.registry.add('occupations');
        occupations.forEach((data)=>{
            occupationsReg.add(data.namespace, data);
        });
        let npcStatsReg = this.registry.add('npc_stats');
        npcStats.forEach((data)=>{
            npcStatsReg.add(data.namespace, data);
        });
        let dialogReg = this.registry.add('dialog');
        dialog.forEach((data)=>{
            dialogReg.add(data.namespace, data);
        });
    }

    render() {

        return (
            <div className="App">
                <NavBarComponent app={this}/>
                <HeaderComponent />
                <div className="container">
                    <div className="row">
                        <div className="span5 bs-docs-sidebar">

                            { this.state.selected_lot &&
                            <LotDetailComponent app={this} lot={this.state.selected_lot} />
                            }
                            {this.state.selected_npc &&
                            <NPCDetailComponent app={this} npc={this.state.selected_npc}/>
                            }
                            { this.state.selected_building &&
                            <BuildingDetailComponent app={this} building={this.state.selected_building} />
                            }

                        </div>
                        <div className="span7" >

                            {!this.state.started &&
                            <div className="jumbotron">
                                <h1>Necropolis</h1>
                                <p className="lead">It would appear that the end of days is upon us. You and 3 of your friends find yourself in the middle of a Zombie apocalypse. They look to you to lead them forward through these perilous times.
                                </p>
                                <a className="btn btn-large btn-success" href="#" onClick={this.start}>Begin your journey</a>
                            </div> }
                            {this.state.text }
                        </div>
                    </div>
                    <ModalComponent app={this} onStart={(modal)=>{
                         this.gui.taskAssignmentModal = modal;
                    }}>
                        <TaskAssignmentComponent app={this} />
                    </ModalComponent>
                </div>
            </div>
        );
    }
    start() {
        this.setState({started:true});
        this.setupCanvas();

        this.map = new Map({
            app: this
        })

// Listen for animate update

        this.setState({
            globalLifecycle : 0,
            ticksSinceLastCycle: 0,
            ticksSinceNPCPhysics:0,
            ticksSinceNPCAI:0
        })
        app.ticker.add(this.tick.bind(this));


        this.populateStartTeam();
        this.refreshFactionLotStates();
        this.map.render( this.pixicontainer );



    }
    tick(delta){


        let newState = {
            globalLifecycle : this.state.globalLifecycle  + app.ticker.elapsedMS,
            ticksSinceLastCycle: this.state.ticksSinceLastCycle + app.ticker.elapsedMS,
            ticksSinceNPCPhysics: this.state.ticksSinceNPCPhysics + app.ticker.elapsedMS,
            ticksSinceNPCAI: this.state.ticksSinceNPCAI + app.ticker.elapsedMS
        };
        if(newState.ticksSinceLastCycle  > 10000){
            this.startCycle();
            newState.ticksSinceLastCycle = 0;
        }
        this.setState(newState);

        if(newState.ticksSinceNPCPhysics > 20) {
            this.tickCountDowns(this.state.ticksSinceNPCPhysics);

            this.state.ticksSinceNPCPhysics = 0;



            this.npcs.forEach((npc)=>{
                if(!npc.lot || !npc.lot.getFactionLotState(this.playerFaction, Lot.States.OBSERVED)){
                    return;
                }
                npc.tickPhysics(app.ticker.elapsedMS);

            })
        }else if(newState.ticksSinceNPCAI > 1000){
            this.state.ticksSinceNPCAI = 0;
            this.npcs.forEach((npc)=>{
                if(!npc.lot || !npc.lot.getFactionLotState(this.playerFaction, Lot.States.OBSERVED)){
                    return;
                }
                if(npc.name){
                    //npc.setCaption(npc.name);
                }
                npc.tickAI(app.ticker.elapsedMS);
                npc.tickBiology(app.ticker.elapsedMS);

            })
        }

    }
    startCycle(){
        this.setState({cycleCount: this.state.cycleCount + 1});
    }
    populateStartTeam(){
        //TODO: Pormpt player name
        this.playerFaction = new Faction({
            "namespace":"player_1"
        })
        this.factions.push(this.playerFaction );
        let startLot = this.map.get(0,0 );
        for(let i = 0; i < 4 ; i++){
            let npc = this.addNPC({
                type: NPC.Type.HUMAN,
                faction: this.playerFaction ,
                lot: startLot
            })
            npc.populateStats({
                type: "*"
            });
            npc.populateRandom();
            npc.addAIBehavior(new NPCTaskBehavior({
                priority: 20
            }));
            npc.addAIBehavior(new NPCWonderBehavior({
                priority: 50
            }));
            startLot.npcs.push(
                npc
            );



        }
        startLot.shuffleNPCSLotPos();
    }
    refreshFactionLotStates(){
        this.map.each((lot)=>{
            this.factions.forEach((faction)=>{
                lot.resetFactionLotStates(faction);
            })
        })
        this.npcs.forEach((npc)=>{
            if(!npc.faction){
                return;
            }
            npc.lot.setFactionLotState(npc.faction, Lot.States.EXPLORED, true);
            npc.lot.setFactionLotState(npc.faction, Lot.States.OCCUPIED, true);
            npc.lot.setFactionLotState(npc.faction, Lot.States.OBSERVED, true);
            npc.lot.setFactionLotState(npc.faction, Lot.States.MAPPED, true);
            for(let x = npc.lot.x - 1; x < npc.lot.x + 2; x++){
                for(let y = npc.lot.y - 1; y < npc.lot.y + 2; y++){
                    let lot = this.map.get(x, y);
                    lot.setFactionLotState(npc.faction, Lot.States.OBSERVED, true);
                    lot.setFactionLotState(npc.faction, Lot.States.MAPPED, true);
                }
            }
        })
    }
    setupCanvas(){

        this.mainContainer  = document.getElementById("mainContainer");
        let args = {
            width: window.jQuery(this.mainContainer ).width(),
            height: window.jQuery(this.mainContainer ).height(),
            backgroundColor: 0x000084,
            resolution: window.devicePixelRatio || 1
        };


        this.pixi = new PIXI.Application(args);
        this.mainContainer.appendChild(this.pixi.view );
        /*      this.pixi.view.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
              });*/
        this.pixicontainer =  new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,

            interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
        });

        this.pixi.stage.addChild(this.pixicontainer);





// Move container to the center
        this.pixicontainer.x = this.pixi.screen.width / 2;
        this.pixicontainer.y = this.pixi.screen.height / 2;

// Center bunny sprite in local container coordinates
        this.pixicontainer.pivot.x = this.pixicontainer.width / 2;
        this.pixicontainer.pivot.y = this.pixicontainer.height / 2;





// activate plugins
        this.pixicontainer
            .drag()
            .pinch()
            .wheel()
            .decelerate();

        this.pixicontainer.zoom(-700);//-1028



    }
    addNPC(data){
        data.app = this;
        data.id = this._npcId++;
        let npc = new NPC(data);
        this.npcs.push(npc);
        return npc;
    }
    sleepNPC(npc){

        this.npcs = _.reject(this.npcs, (_npc)=>{
            return npc.id == _npc.id;
        })

        npc.lot.removeNPC(npc)
        npc.sleep();
    }
    selectTile(lot){
        this.guiClearSelection();
        this.setState({selected_lot: lot});
        lot.guiSelect();
    }
    guiSelectBuilding(building){
        this.guiClearSelection();
        this.setState({selected_building: building});
        building.guiSelect();
    }
    guiClearSelection(){
        if(this.state.selected_building){
            this.state.selected_building.guiDeselect();
            this.state.selected_building = null;

        }
        if(this.state.selected_lot){
            this.state.selected_lot.guiDeselect();
            this.state.selected_lot = null;

        }
        if(this.state.selected_npc){
            this.state.selected_npc.guiDeselect();
            this.state.selected_npc = null;
        }
        this.setState({selected_lot: null, selected_npc: null});
    }
    guiSelectNPC(npc){
        this.guiClearSelection();
        this.setState({selected_npc: npc});

    }
    guiPromptTask(options){

        this.gui.taskAssignmentComponent.show(options)
    }
    getNPCsByFaction(faction){
        let npcs = [];

        this.npcs.forEach((npc)=>{

            if(npc.faction && npc.faction.namespace == faction.namespace){
                npcs.push(npc);
            }
        })
        return npcs;
    }
    addCountDown(duration, _function, namespace){
        let tickCounter = {
            duration: duration,
            _function: _function,
            namespace: namespace || "tc_" + Math.random() * 9999
        };
        this.tickCounters.push(tickCounter)
        return tickCounter;
    }
    removeCountDown(namespace){
        this.tickCounters = _.reject(this.tickCounters, (tickCounter)=>{
            return namespace == tickCounter.namespace;
        })
    }
    tickCountDowns(deltaMS){
        let firingTickCounters = [];
        this.tickCounters.forEach((tickCounter)=>{
            tickCounter.duration -= deltaMS;
            if(tickCounter.duration <= 0){
                firingTickCounters.push(tickCounter);
            }
        })
        firingTickCounters.forEach((tickCounter)=>{
            tickCounter._function();
            this.removeCountDown(tickCounter.namespace);
        })
    }
}

export default App;
