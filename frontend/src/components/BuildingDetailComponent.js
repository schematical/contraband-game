import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";
import Lot from "../model/lot";
import NPCMoveTask from "../model/ai/NPCMoveTask";


class BuildingDetailComponent extends Component {
  constructor(props){
    super(props);
    this.promptActionEnter = this.promptActionEnter.bind(this);
  }
  render() {
    return (
        <div>
          <ul className="nav nav-list bs-docs-sidenav">
            <li>
              <a>
              {this.props.building.name || this.props.app.registry.buildings.get(this.props.building.type).name}
              </a>
            </li>
            <li className="nav-header">NPCs</li>
            {this.props.building.lot.getFactionLotState(this.props.app.playerFaction, Lot.States.EXPLORED) ?
                <NPCListComponent npcs={this.props.building.npcs} app={this.props.app} onClick={(event, npc)=>{ event.preventDefault(); return this.app.guiSelectNPC(npc) }} />
                :
                <span>Unexplored...</span>
            }
            <li className="nav-header">Materials</li>
            <li>
              <a href="#file-structure">
                Cover: {this.props.building.cover}
              </a>
            </li>
            <li>
              <a href="#file-structure">
                Ingress: {this.props.building.ingress}
              </a>
            </li>
            <li>
              <a href="#file-structure">
                Egress: {this.props.building.egress}
              </a>
            </li>
            <li>
              <a href="#file-structure">
                Primary Material: {this.props.building.primaryMaterial.name}
              </a>
            </li>
            <li>
              <a href="#file-structure">
                Secondary Material: {this.props.building.secondaryMaterial.name}
              </a>
            </li>
            <li>
              <a href="#file-structure">
                Fortification Material: {this.props.building.fortificationMaterial.name}
              </a>
            </li>

            <li className="nav-header">Actions</li>
            <li>
              <a href="#file-structure" onClick={this.promptActionEnter}>
                Enter
              </a>
            </li>
          </ul>
        </div>
    );
  }
  promptActionEnter(event){

    this.props.app.guiPromptTask({
      onComplete:()=>{
        console.log("DONE");
        this.props.building.lot.setFactionLotState(this.props.app.playerFaction, Lot.States.ALLOWED, true);
      },
      taskConstructor:(npc)=>{
        let task = new NPCMoveTask({
          lot:this.props.building.lot,
          building: this.props.building
        })
        return task;
      }
    });
  }

}

export default BuildingDetailComponent;
