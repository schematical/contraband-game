import React, { Component } from 'react';
import buildings from './data/buildings.json';
import events from './data/events.json';
import materials from './data/materials.json';
import occupations from './data/occupations.json';
import populationStats from './data/population_stats.json';
import './App.css';
import * as PIXI from 'pixi.js';
import NavBarComponent from "./components/NavBarComponent";
import HeaderComponent from "./components/HeaderComponent";
import ModRegistry from "mod-registry";
import seedrandom  from 'seedrandom';
import Map from './model/map';
const app = new PIXI.Application();
const Viewport = require('pixi-viewport');

class App extends Component {
    constructor(props) {
        super(props);
        this.rnd = seedrandom(Math.random());
        this.state = {
            username: "",
            password:""
        }
        this.setupRegistry();
       /* this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);*/
        this.start = this.start.bind(this);
        this.gui = {};
        this.gui.text = "";

    }
    setupRegistry(){
        this.registry = new ModRegistry({
            namespace: "necropolis",
            rnd: this.rnd
        });
        let buildingReg = this.registry.add('buildings');
        buildings.forEach((data)=>{
            buildingReg.add(data.namespace, data);
        });

        let eventsReg = this.registry.add('events');
        events.forEach((data)=>{
            eventsReg.add(data.namespace, data);
        });
        let materialsReg = this.registry.add('materials');
        materials.forEach((data)=>{
            materialsReg.add(data.namespace, data);
        });
        let occupationsReg = this.registry.add('occupations');
        occupations.forEach((data)=>{
            occupationsReg.add(data.namespace, data);
        });
        let populationStatsReg = this.registry.add('population_stats');
        populationStats.forEach((data)=>{
            populationStatsReg.add(data.namespace, data);
        });
    }
  render() {

    return (
      <div className="App">
          <NavBarComponent />
          <HeaderComponent />
          <div className="row">
              <div className="span3 bs-docs-sidebar">
                  { this.state.selected_building &&
                      <ul className="nav nav-list bs-docs-sidenav">
                          <li><a href="#download-bootstrap">{this.state.selected_building.type}</a></li>
                            {this.state.selected_building.npcs.map((value, index) => {
                                      return <li><a href="#file-structure"><i className="icon-chevron-right"></i> {value.type} {index}</a></li>
                                })
                            }

                      </ul>
                  }
                  { this.state.selected_tile &&
                  <ul className="nav nav-list bs-docs-sidenav">
                      <li><a href="#download-bootstrap">{this.state.selected_tile.x}, {this.state.selected_tile.y}</a></li>
                      {this.state.selected_tile.npcs.map((value, index) => {
                          return <li><a href="#file-structure"><i className="icon-chevron-right"></i> {value.type} {index}</a></li>
                      })
                      }

                  </ul>
                  }
              </div>
              <div className="span9" >
                  <button onClick={this.start}>Start</button>
                  {this.state.text }
              </div>
          </div>


      </div>
    );
  }
  start() {
        this.setupCanvas();

        this.map = new Map({
            app: this
        })

// Listen for animate update
        app.ticker.add((delta) => {

        });

        for(let x = -6; x < 6; x++){
            for(let y = -6; y < 6; y++){
                this.map.get(x,y );
            }
        }

      this.map.render( this.pixicontainer );

/*          const bunny = new PIXI.Sprite( this.textures.bunny );
          bunny.anchor.set(0.5);

          this.pixicontainer.addChild(bunny);*/


  }
  setupCanvas(){

      this.mainContainer  = document.getElementById("mainContainer");
      let args = {
          width: window.jQuery(this.mainContainer ).width(),
          height: window.jQuery(this.mainContainer ).height(),
          backgroundColor: 0x000084,
          resolution: window.devicePixelRatio || 1
      };


      this.pixi = new PIXI.Application(args);
      this.mainContainer.appendChild(this.pixi.view );

      this.pixicontainer =  new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          worldWidth: 1000,
          worldHeight: 1000,

          interaction: app.renderer.plugins.interaction // the interaction module is important for wheel() to work properly when renderer.view is placed or scaled
      });

      this.pixi.stage.addChild(this.pixicontainer);
      // Create a new texture
      this.textures = {};




// Move container to the center
      this.pixicontainer.x = this.pixi.screen.width / 2;
      this.pixicontainer.y = this.pixi.screen.height / 2;

// Center bunny sprite in local container coordinates
      this.pixicontainer.pivot.x = this.pixicontainer.width / 2;
      this.pixicontainer.pivot.y = this.pixicontainer.height / 2;





// activate plugins
      this.pixicontainer
          .drag()
          .pinch()
          .wheel()
          .decelerate();



  }

}

export default App;
