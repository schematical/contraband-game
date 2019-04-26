import React, { Component } from 'react';


class NPCListComponent extends Component {
  constructor(props){
    super(props);
    this.setupOnClick = this.setupOnClick.bind(this);
  }
  render() {
    if(this.props.table){
      return this.renderTable();
    }
    return (<div>
      {this.props.npcs.map((npc, index2) => {
        return(
            <li>
              <a href="#file-structure" onClick={this.setupOnClick(npc)}>
                {npc.name || npc.type} {index2}
              </a>
            </li>
            )
      })}</div>
    );
  }
  renderTable(){
    return (
        <table className="table table-condensed">
          {this.props.npcs.map((npc, index2) => {
            return  <tr className="success">
                  <td>{npc.name || (npc.type + " " + index2)}</td>
                  <td>TB - Monthly</td>
                  <td>01/04/2012</td>
                  <td>
                    <button onClick={(event)=>{ event.preventDefault(); return  this.app.guiSelectNPC(npc) }}>Select</button>
                  </td>
                </tr>

          })}

        </table>
    )
  }
  setupOnClick(npc){
    return (event) => {
      if (this.props.onClick) {
        this.props.onClick(event, npc);
      }
      event.preventDefault();
    }

  }
}

export default NPCListComponent;
