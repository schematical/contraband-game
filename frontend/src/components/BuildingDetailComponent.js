import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";


class BuildingDetailComponent extends Component {
  constructor(props){
    super(props);

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
            <NPCListComponent npcs={this.props.building.npcs} app={this.props.app} />
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
              <a href="#file-structure">
                Clear
              </a>
            </li>
          </ul>
        </div>
    );
  }
  onClick(event){

  }

}

export default BuildingDetailComponent;
