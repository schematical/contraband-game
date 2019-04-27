import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";
import Lot from "../model/lot";
import NPCMoveTask from "../model/ai/NPCMoveTask";


class LotDetailComponent extends Component {
  constructor(props){
    super(props);
    this.app = props.app;
    this.lot = props.lot;
    this.promptActionExplore = this.promptActionExplore.bind(this);
  }
  render() {
    return (
        <ul className="nav nav-list bs-docs-sidenav">
            <li><a href="#download-bootstrap">LOT {this.lot.x}, {this.lot.y}</a></li>
            <NPCListComponent npcs={this.lot.npcs} onClick={(event, npc)=>{ event.preventDefault(); return this.app.guiSelectNPC(npc) }}/>
            {/*{this.lot.npcs.map((npc, index) => {
                return <li><a href="#file-structure" onClick={(event)=>{ event.preventDefault(); return this.app.guiSelectNPC(npc) }}>
                    <i className="icon-chevron-right"></i> {npc.name || npc.type} {index}</a>
                </li>
            })}*/}
            <li className="nav-header">Buildings</li>
            {this.lot.buildings.map((building, index) => {
                return <div>
                    <li>
                        <a href="#file-structure"  onClick={(event, npc)=>{ event.preventDefault(); return this.app.guiSelectBuilding(building) }} >
                            <i className="icon-chevron-right"></i>
                            {this.app.registry.buildings.get(building.type).name} {index}
                        </a>
                    </li>
                    <NPCListComponent npcs={building.npcs} onClick={(event, npc)=>{ event.preventDefault(); return this.app.guiSelectNPC(npc) }} />
                    {/*{building.npcs.map((npc, index2) => {
                        return <li>
                            <a href="#file-structure" onClick={(event)=>{ event.preventDefault(); return  this.app.guiSelectNPC(npc) }}>
                                <i className="icon-chevron-right"></i>
                                {npc.type} {index2}
                            </a>
                        </li>;
                    })}*/}
                </div>
            })}
            <li className="nav-header">Actions</li>
            {
                !this.lot.getFactionLotState(this.app.playerFaction, Lot.States.EXPLORED) &&
                <li>
                    <a href="#file-structure" onClick={this.promptActionExplore}>
                        Explore
                    </a>
                </li>
            }
        </ul>
    );
  }
    promptActionExplore(event){
        this.props.app.guiPromptTask({
            taskConstructor:(npc)=>{
                let task = new NPCMoveTask({
                    lot:this.lot
                })
                return task;
            }
        });
    }
}

export default LotDetailComponent;
