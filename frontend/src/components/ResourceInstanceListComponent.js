import React, { Component } from 'react';


class ResourceInstanceListComponent extends Component {
  constructor(props){
    super(props);
    this.setupOnClick = this.setupOnClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

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
      {this.props.resources.map((resourceInstance, index2) => {
        return(
            <li key={index2}>
              <a href="#file-structure" onClick={this.setupOnClick(resourceInstance)}>
                {resourceInstance.type.name} {resourceInstance.count}
              </a>
            </li>
            )
      })}</div>
    );
  }
  /*renderTable(){
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
  }*/
  setupOnClick(resourceInstance){
    return (event) => {
      if (this.props.onClick) {
        this.props.onClick(event, resourceInstance);
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

export default ResourceInstanceListComponent;
