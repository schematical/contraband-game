

import React, { Component } from 'react';
import NPCListComponent from "./NPCListComponent";
import Lot from "../model/lot";


class ModalComponent extends Component {
    constructor(props){

        super(props);

        this.app = props.app;
        this.lot = props.lot;
        this.onSubmit = this.onSubmit.bind(this);
        this.uniqueId = "modal_" + Math.round(Math.random() * 9999);
        this.props.onStart(this);

    }
    render() {
        return (
            <div id={this.uniqueId} className="modal hide" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 id="modalLabel">{this.header}</h3>
                </div>
                <div className="modal-body">
                    {this.props.children}
                </div>
                <div className="modal-footer">
                    <button className="btn" data-dismiss="modal">Close</button>
                    <button className="btn btn-primary">Save changes</button>
                </div>
            </div>
        );
    }
    onSubmit(event){

    }
    show(){
        window.jQuery('#' +  this.uniqueId).modal('show');
    }
    hide(){
        window.jQuery('#' +  this.uniqueId).modal('hide');
    }
}

export default ModalComponent;

