import Building from './building';
import Tile from './tile';
import * as PIXI from 'pixi.js';
import Material from "./material";
import Population from "./population";
import NPC from "./npc";
import {Helper} from "../util/Helper";
import _ from "underscore";
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
        this.populateRandomBuilding();



        this.emptyTileCoords = [];
        for(let x = 0; x < 4; x++){
            for(let y = 0; y < 4; y++){
                let tile = this.getTile(x,y);
                if(!tile){
                    this.emptyTileCoords.push({
                        x:x,
                        y:y
                    })
                }
            }
        }

        this.populateNPCs();

       /* let populationColl = [];
        populationColl.push(new Population({
            type:Population.Type.ZOMBIE,
            count: Math.floor(this.app.rnd() * 10),
            aggression: Math.floor(this.app.rnd() * 10)
        }));
*/



    }
    populateNPCs(){
        this.npcs = [];
        if(this.emptyTileCoords.length == 0){
            return;
        }

        let zombieNpcChance = Math.floor((this.app.rnd() * 10) - 5);

        for(let i = (zombieNpcChance); i > 0; i -= 1){

            this.npcs.push(
                new NPC({
                    type: NPC.Type.ZOMBIE,
                    faction: null,//CIVILIAN ??,
                    lot: this
                })
            )
        }

        let npcChance = Math.floor((this.app.rnd() * 25) - 20);

        for(let i = (npcChance); i > 0; i -= 1){

            this.npcs.push(
                new NPC({
                    type: NPC.Type.HUMAN,
                    faction: null,//CIVILIAN ??,
                    lot: this
                })
            )
        }


        let npcsToTilesRatio =  this.emptyTileCoords.length / this.npcs.length ;
        let index = 0;
        _.shuffle(this.npcs).forEach((npc)=>{
            npc.lotPos = this.emptyTileCoords[Math.floor(index)];
            if(!npc.lotPos){
                throw new Error("Your math is off");
            }
            index += npcsToTilesRatio;
        });

    }
    populateRandomBuilding(){

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
                    y: y,
                    bottom: (y + 1 == _y + depth)
                })
                building.tiles.push(this.cols[x][y]);
            }
        }
        building.populateNPCs();
        this.buildings.push(building);
    }
    render(container){


        var canvas = document.getElementById("sketchPad")
        var ctx = canvas.getContext('2d');

        let size = 64;
        ctx.clearRect(0,0,  canvas.width, canvas.height);
        var img = new ImageData(size, size);
        let colorStr = "#000000";

        let color = Helper.hexToRgb(colorStr);
        let i = 0;
        for(let y = 0; y < size; y++){
            for(let x = 0; x < size; x++){


                let multiplier = 1;

                img.data[i * 4] = color.r * multiplier;
                img.data[i * 4 + 1] = color.g * multiplier;
                img.data[i * 4 + 2] = color.b * multiplier;
                img.data[i * 4 + 3] = 128;

                //bmp.pixel[x][y] = color;
                i++;
            }
        }

        ctx.putImageData(img, 0, 0);
        //	set pixel colour, components in the range [0, 1]
        //bmp.subsample(n)//	scale down by integer factor n
        let url = canvas.toDataURL()

        let texture = PIXI.Texture.fromImage(url);
        this.sprite = new PIXI.Sprite((texture));// this.lot.app.textures.bunny ));
        //sprite.anchor.set(0.5);
        this.sprite.x = this.x * (size + 8);
        this.sprite.y = this.y * (size + 8);
        container.addChild(this.sprite);
        // Opt-in to interactivity
        this.sprite.interactive = true;

// Shows hand cursor
        this.sprite.buttonMode = true;

// Pointers normalize touch and mouse
        this.sprite.on('pointerdown', _.bind(this.onPointerDown, this));
        this.sprite.on('pointerover',  _.bind(this.onPointerOver, this));
        this.sprite.on('pointerout',  _.bind(this.onPointerOut, this))

        container.addChild(this.sprite);
        this.eachTile((tile)=>{
            tile.render(this.sprite);//this.container);
        })
        this.npcs.forEach((npc)=>{
            npc.render(this.sprite);
        });

    }
    getTile(x, y){
        return this.cols[x] && this.cols[x][y] || null;
    }
    eachTile(iterator){

        this.cols.forEach((col)=>{
            col.forEach((tile)=>{
                iterator(tile);
            })
        })
    }
    onPointerDown(){
        this.app.setState({selected_tile: this});
    }
    onPointerOver(){
        let debugText = "(" + this.x + ", " + this.y + ")";
        this.app.setState({text: debugText});

    }
    onPointerOut(){
        this.app.setState({text: ""});
    }


}
export default Lot;