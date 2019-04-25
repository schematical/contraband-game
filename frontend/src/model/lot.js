import Building from './building';
import Tile from './tile';
import * as PIXI from 'pixi.js';
import Material from "./material";
class Lot{
    constructor(data){
        this.app = data.app;
        this.cols = [];
        this.x = data.x;
        this.y = data.y;
        this.buildings = [];
    }
    get(x,y){
        if(!this.cols[x]){
            this.cols[x] = [];
        }
        let tile = this.cols[x][y] || null;
        if(!tile){


        }
        return tile;
    }
    populateRandom(){
        let _x = 0;
        let _y = 0;
        let data = this.app.registry.buildings.rnd();
        let primaryMaterialNamespace = this.app.registry.rndColl(data, "primary_materials", "schematical:material:wood");
        let secondaryMaterialNamespace = this.app.registry.rndColl(data, "secondary_materials", "schematical:material:none");
        let depth = this.app.registry.range(data, "size", 1);
        let width = this.app.registry.range(data, "size", 1);
        let startX = Math.floor(Math.random() * (4 - width));
        let startY = Math.floor(Math.random() * (4 - depth));

        _x += startX;
        _y += startY;

        let building = new Building({
            lot: this,
            x: _x + startX,
            y: _y + startY,
            type: data.namespace,
            tiles: [],
            height: this.app.registry.range(data, "height", 1),
            primaryMaterial: new Material(
                this.app.registry.materials.get(
                    primaryMaterialNamespace
                )
            ),
            secondaryMaterial: new Material(
                this.app.registry.materials.get(
                    secondaryMaterialNamespace
                )
            ),
            fortificationMaterial: new Material(this.app.registry.materials.get("schematical:material:none"))
        });





        //Create tiles
        for(let x = _x; x < _x + width; x += 1){
            for(let y = _y; y < _y + depth; y += 1){
                this.cols[x] =  this.cols[x] || [];
                this.cols[x][y] = new Tile({
                    lot: this,
                    building: building,
                    x: x,
                    y: y
                })
                building.tiles.push(this.cols[x][y]);
            }
        }
        this.buildings.push(building);
    }
    render(container){
        console.log("Rendering Lot: " + this.x + ". " + this.y);
        this.container = new PIXI.Container();
        this.container.x = this.x * 64;
        this.container.y = this.y * 64;
        container.addChild(this.container);
        this.eachTile((tile)=>{
            tile.render(this.container);//this.container);
        })

    }
    eachTile(iterator){
        this.cols.forEach((col)=>{
            col.forEach((tile)=>{
                iterator(tile);
            })
        })
    }

}
export default Lot;