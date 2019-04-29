import React, { Component } from 'react';

import * as _ from "underscore";
import Building from "../model/building";

class NPCRecruitComponent extends Component {
  constructor(props){
    super(props);

    this.onAccept = this.onAccept.bind(this);
    this.onDeny = this.onDeny.bind(this);
    this.props.app.gui.npcRecruitComponent = this;
    this.child = React.createRef()

    //this.buildingAssignments = this.props.app.registry.building_assignments.list();

  }
  render() {

    return (
        <form>
          <p>
            "Hello my name is <b>{this.npc && this.npc.name}</b>, I was working as a <b>{this.npc && this.npc.occupation.name}</b> before it all hit the fan. Can I join up with you guys?"
          </p>
          <button className="btn" data-dismiss="modal" onClick={this.onAccept}>Accept</button>
          <button className="btn" data-dismiss="modal" onClick={this.onDeny}>Deny</button>
        </form>

    );
  }
  onAccept(event){
    this.npc.faction = this.props.app.playerFaction;
    this.props.app.addAlert({
      text: this.npc.name + " has joined your group"
    })
    this.npc.clearAIBehaviors();
    this.props.app.aiManager.setupCivilian( this.npc );
    this.npc.lot.render(this.props.app.pixicontainer);
    this.props.app.gui.npcRecruitModal.hide();
    this.npc._being_recruited = false;
  }
  onDeny(event){
    this.npc._recruit_denied = true;
    this.npc._being_recruited = false;
    this.props.app.gui.npcRecruitModal.hide();
  }

  show(options){
    this._options = options;

    if(_.isUndefined(this._options.npc)){
      throw new Error("Need a `npc`");
    }
    this.npc = this._options.npc;
    if(!this.npc._populated){
      this.npc.populateRandom();
    }
    this.npc._being_recruited = true;
    this.props.app.gui.npcRecruitModal.show();
  }

}


export default NPCRecruitComponent;
