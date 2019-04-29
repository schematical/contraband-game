import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";
import Lot from "../model/lot";
import NPCMoveTask from "../model/ai/NPCMoveTask";
import Building from "../model/building";
import ResourceInstanceListComponent from "./ResourceInstanceListComponent";


class BuildingDetailComponent extends Component {
  constructor(props){
    super(props);
    this.promptActionEnter = this.promptActionEnter.bind(this);
    this.promptActionEgress = this.promptActionEgress.bind(this);
    this.promptAssignBuilding = this.promptAssignBuilding.bind(this);
  }
  render() {
    return (
        <div>
          <ul className="nav nav-list bs-docs-sidenav">
            <li>

              {this.props.building.name || this.props.building.type.name}

            </li>
            <li>
              {this.props.building.getFactionLotState(this.props.app.playerFaction, Building.States.ASSIGNMENT) ?
                  <div>
                    {this.props.building.getFactionLotState(this.props.app.playerFaction, Building.States.ASSIGNMENT).name }
                    <a href="#file-structure" onClick={this.promptAssignBuilding}>
                      Re-assign
                    </a>
                  </div>
                  :
                  <div>
                    Unassigned
                    <a href="#file-structure" onClick={this.promptAssignBuilding}>
                      Assign
                    </a>
                  </div>
              }
            </li>
            <li className="nav-header">NPCs</li>
            {this.props.building.getFactionLotState(this.props.app.playerFaction, Building.States.EXPLORED) ?
                <NPCListComponent npcs={this.props.building.npcs} app={this.props.app} onClick={(event, npc)=>{ event.preventDefault(); return this.app.guiSelectNPC(npc) }} />
                :
                <span>Unexplored...</span>
            }
            <li className="nav-header">Materials</li>
            <li>

                Cover: {this.props.building.cover}

            </li>
            <li>

                Ingress: {this.props.building.ingress}

            </li>
            <li>

                Egress: {this.props.building.egress}

            </li>
            <li>

                Primary Material: {this.props.building.primaryMaterial.name}

            </li>
            <li>

                Secondary Material: {this.props.building.secondaryMaterial.name}

            </li>
            <li>
                Fortification Material: {this.props.building.fortificationMaterial.name}
            </li>
            <li className="nav-header">Resources</li>
            <ResourceInstanceListComponent app={this.props.app} resources={this.props.building.resources} />
            <li className="nav-header">Actions</li>
            <li>
              <a href="#file-structure" onClick={this.promptActionEnter}>
                Enter
              </a>
            </li>
            {this.props.building.getFactionLotState(this.props.app.playerFaction, Building.States.OCCUPIED) &&
              <li>
                <a href="#file-structure" onClick={this.promptActionEgress}>
                  Evacuate
                </a>
              </li>
            }
          </ul>
        </div>
    );
  }
  promptActionEnter(event){

    this.props.app.guiPromptTask({
      onComplete:()=>{
        console.log("DONE");
        this.props.building.lot.setFactionLotState(this.props.app.playerFaction, Lot.States.ALLOWED, true);
        this.props.building.setFactionLotState(this.props.app.playerFaction, Building.States.ALLOWED, true);
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
  promptActionEgress(event){

    this.props.app.guiPromptTask({
      onComplete:()=>{

        //this.props.building.lot.setFactionLotState(this.props.app.playerFaction, Lot.States.ALLOWED, true);
      },
      taskConstructor:(npc)=>{
        let task = new NPCMoveTask({
          lot:this.props.building.lot,
          //building: this.props.building
        })
        return task;
      }
    });
  }
  promptAssignBuilding(event){

    this.props.app.gui.buildingAssignmentComponent.show({
      building: this.props.building,
      onComplete:()=>{

        //this.props.building.lot.setFactionLotState(this.props.app.playerFaction, Lot.States.ALLOWED, true);
      },
     /* taskConstructor:(npc)=>{
        let task = new NPCMoveTask({
          lot:this.props.building.lot,
          //building: this.props.building
        })
        return task;
      }*/
    });
  }

}

export default BuildingDetailComponent;
