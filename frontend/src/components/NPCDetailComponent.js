import React, { Component } from 'react';


class NPCDetailComponent extends Component {
  constructor(props){
    super(props);
    this.app = props.app;
    this.npc = props.npc;
  }
  render() {
    return (
        <div>
          <ul className="nav nav-list bs-docs-sidenav">
            <li>
              <a>
              {this.npc.name || this.npc.type}
              </a>
            </li>
            <li>
              <a data-title={this.npc.occupation.name} data-content={this.npc.occupation.notes}>
              Occupation: {this.npc.occupation.name}
              </a>
            </li>
            { Object.keys(this.npc.stats).map((statNamespace, index) => {
              return <li>
                  <a href="#file-structure">
                    <i className="icon-chevron-right"></i>
                    {this.app.registry.npc_stats.get(statNamespace).name} {this.npc.stats[statNamespace]}
                  </a>
                </li>
            })}
          </ul>
        </div>
    );
  }
  onClick(event){

  }

}

export default NPCDetailComponent;
