import React, { Component } from 'react';

import * as _ from "underscore";
import Building from "../model/building";

class BuildingAssignmentComponent extends Component {
  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.props.app.gui.buildingAssignmentComponent = this;
    this.child = React.createRef()
    this.buildingAssignments = this.props.app.registry.building_assignments.list();

  }
  render() {

    return (
        <form>
          <fieldset>
            <legend>{this.building && this.building.name}</legend>
            <label>Assignment: </label>
            <div className="input-append">

                <div className="btn-group">
                  <button className="btn dropdown-toggle" data-toggle="dropdown">
                    {this.assignment && this.assignment.name || "Unassigned"}
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    { Object.keys(this.buildingAssignments).map((namespace, index) => {
                      return <li key={namespace}>
                        <a href="#file-structure" onClick={this.onClick(this.buildingAssignments[namespace])}>
                          {this.buildingAssignments[namespace].name}
                        </a>
                      </li>
                    })}
                    <li>
                      <a href="#file-structure" onClick={this.onClick(null)}>
                        Unassigned
                      </a>
                    </li>
                  </ul>
                </div>
            </div>
            {this.assignment &&
                <div>
                  <h3>{this.assignment.name}</h3>
                  <p>
                    {this.assignment.desc}
                  </p>
                </div>
            }
          </fieldset>
          <button className="btn" data-dismiss="modal" onClick={this.onSave}>Assign</button>
        </form>

    );
  }
  onClick(buildingAssignment){
    return (event)=>{
      this.assignment = buildingAssignment;

    }
  }
  onSave(event){
    this.building.setFactionLotState(this.props.app.playerFaction, Building.States.ASSIGNMENT, this.assignment);
    this.props.app.gui.buildingAssignmentModal.hide();
  }

  show(options){
    this._options = options;

    if(_.isUndefined(this._options.building)){
      throw new Error("Need a `building` in order to assign building");
    }
    this.building = this._options.building;
    this.assignment = this.building.getFactionLotState(this.props.app.playerFaction, Building.States.ASSIGNMENT);
    this.props.app.gui.buildingAssignmentModal.show();
  }

}


export default BuildingAssignmentComponent;
