import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";


class LotDetailComponent extends Component {
  constructor(props){
    super(props);
    this.app = props.app;
    this.lot = props.lot;
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
            <li className="divider"></li>
            {this.lot.buildings.map((building, index) => {
                return <div>
                    <li>
                        <a href="#file-structure">
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
        </ul>
    );
  }
}

export default LotDetailComponent;
