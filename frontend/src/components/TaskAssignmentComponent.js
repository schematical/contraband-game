

import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";
import Lot from "../model/lot";
import NPCMoveTask from "../model/ai/NPCMoveTask";
import * as _ from "underscore";


class TaskAssignmentComponent extends Component {
    constructor(props){
        super(props);
        this.app = props.app;
        this.lot = props.lot;
        this.onSubmit = this.onSubmit.bind(this);
        this.app.gui.taskAssignmentComponent = this;
        this.child = React.createRef()

    }
    render() {

        return (
            <div>
                { this.npcs && <div>
                    <span>NPC Count: {this.npcs.length}</span>
                    <NPCListComponent app={this.app} npcs={this.npcs} table={true} ref={this.child} />
                    <button onClick={this.onSubmit}>Assign</button>
                </div>
                }
            </div>

        );
    }
    onSubmit(event){
        let selectedNPCs = this.child.current.getSelected();
        //Iterate through?
        selectedNPCs.forEach((npc)=>{
            let task = this._options.taskConstructor(npc);
            npc.addTask(
                task
            )
        });
        if(!_.isUndefined(this._options.onComplete)){
            this._options.onComplete(this);
        }
        this.app.gui.taskAssignmentModal.hide();

    }
    show(options){
        this._options = options;
        if(_.isUndefined(this._options.taskConstructor)){
            throw new Error("Need a `taskConstructor` in order to assign tasks");
        }
        this.npcs = this.app.getNPCsByFaction(this.app.playerFaction);
        this.app.gui.taskAssignmentModal.show();
    }

}

export default TaskAssignmentComponent;

