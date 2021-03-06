import React, { Component } from 'react';


class NPCListComponent extends Component {
  constructor(props){
    super(props);
    this.setupOnClick = this.setupOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.props.npcs.forEach((npc)=>{
      npc._selected = true;
    })
  }

  handleChange(event) {
    console.log("Setting: ", event.target.value, event);
    this.setState({value: event.target.value});
  }
  render() {
    if(this.props.table){
      return this.renderTable();
    }
    return (<div>
      {this.props.npcs.map((npc, index2) => {
        return(
            <li key={npc.id}>
              <a href="#file-structure" onClick={this.setupOnClick(npc)}>
                {npc.name || npc.type} {index2} {npc.activeBehavior && npc.activeBehavior.state}
              </a>
            </li>
            )
      })}</div>
    );
  }
  renderTable(){
    return (
        <table className="table table-condensed">
          <tbody>
          {this.props.npcs.map((npc, index2) => {
            return  <tr className="success" key={npc.id}>
                  <td>
                    <input  type="checkbox" value={npc._selected} checked={npc._selected} onChange={(event)=>{
                      npc._selected = !event.target.value;
                    }} />
                  </td>
                  <td>{npc.name || (npc.type + " " + index2)}</td>
                  <td>{npc.activeBehavior && npc.activeBehavior.state}</td>
                  <td>
                    <button onClick={(event)=>{ event.preventDefault(); return  this.app.guiSelectNPC(npc) }}>Select</button>
                  </td>
                </tr>

          })}
          </tbody>
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
  getSelected(){
    let npcs = [];
    this.props.npcs.forEach((npc)=>{
      if(npc._selected){
        npcs.push(npc);
      }
    })
    return npcs;
  }
}

export default NPCListComponent;
