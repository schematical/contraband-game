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
            <li className="nav-header">Info</li>
            {this.npc.occupation &&
              <li>
                <a data-title={this.npc.occupation.name} data-content={this.npc.occupation.notes}>
                  Occupation: {this.npc.occupation.name}
                </a>
              </li>
            }
            { this.npc.stats.getKeys().map((shortNamespace, index) => {
              return <li>
                  <a href="#file-structure">
                    <i className="icon-chevron-right"></i>

                    {shortNamespace} {this.npc.stats[shortNamespace]}
                  </a>
                </li>
            })}
            {
              this.npc.statusEffects.length > 0 &&
                  <div>
                    <li className="nav-header">Info</li>
                    {this.npc.statusEffects.map((statusEffect, index) => {
                    return <li>
                    <a href="#file-structure">
                      {statusEffect.desc}
                    </a>
                    </li>
                  })}
                  </div>
            }
            <li className="nav-header">Actions</li>
            <li>
              <a href="#file-structure">
                Explore
              </a>
            </li>
            <li className="nav-header">Debug</li>
            <li>
              <a href="#file-structure">
                Task Queue Length: {this.npc.tasks.length}
              </a>
            </li>
          </ul>
        </div>
    );
  }
  onClick(event){

  }

}

export default NPCDetailComponent;
