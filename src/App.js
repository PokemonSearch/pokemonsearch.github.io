import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { BarChart } from '@mui/x-charts/BarChart';
import {useSpring, animated} from 'react-spring';
import { alignProperty } from '@mui/material/styles/cssUtils';
import {Text} from 'react-native';
import { evaluateArgument } from './data_analysis';
import { type } from '@testing-library/user-event/dist/type';


const MAX_PKMN = 1025;
var typeChart;
var loadingScale = 50;
var currentTab = 0;
var currently_loading = 0;
var loaded_pkmn = 0;
var finished_loaded_pkmn = 0;
var inline_loaded = 0;
var startedLoading = false;
var activeID = 1;
var activeMon = [];
var monForms = {};
var inSearch = false;
var activeData = [];
var pokeStats= [];
var statNames = {
  'hp':'HP',
  'attack':'Atk',
  'defense':'Def',
  'special-attack':'SpA',
  'special-defense':'SpD',
  'speed':'Spe'
}
var damageFrom = {}
var typeColours = {
  'normal': '#ABAB9B',
  'fire': '#FF4422',
  'water': '#3399FF',
  'electric': '#FFCC33',
  'grass': '#77CC55',
  'ice': '#66CCFF',
  'fighting': '#BB5544',
  'poison': '#AA5599',
  'ground': '#DDBB55',
  'flying': '#8899FF',
  'psychic': '#FF5599',
  'bug': '#AABB22',
  'rock': '#BBAA66',
  'ghost': '#6666BB',
  'dragon': '#7766EE',
  'dark': '#775544',
  'steel': '#AAAABB',
  'fairy': '#EE99EE',
  'none': "#2F2E2E"
}

var statNameVals = [
  'HP',
  'Atk',
  'Def',
  'SpA',
  'SpD',
  'Spe'
]
var form_whitelist = 
    {
        "25": [1, 2, 4, 5, 14, 16],
        "658": [2],
        "718": [1,2,3],
        "735": [],
        "738": [],
        "743": [],
        "752": [],
        "754": [],
        "758": [],
        "774": [7,8,9,10,11,12],
        "777": [],
        "778": [],
        "784": [],
        "1007": [],
        "1008": []
    }
const delay = ms => new Promise(res => setTimeout(res, ms));
var currentQuery = ""
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getWeaknesses(ID)
{
  var weak = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][type] >= 2)
    {
      weak.push([type, damageFrom[ID][type]]);
    }
  }
  return weak;
}

function getResists(ID)
{
  var res = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][type] < 1 && damageFrom[ID][type] > 0)
    {
      res.push([type, damageFrom[ID][type]]);
    }
  }
  return res;
}

function getImmunities(ID)
{
  var imm = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][type] == 0)
    {
      imm.push([type, damageFrom[ID][type]]);
    }
  }
  return imm;
}

function getDamageFromTable(types)
{
  var dmgTable = {"normal": 1, "fighting": 1, "flying": 1, "poison": 1, "ground": 1, "rock": 1, "bug": 1, "ghost": 1, "steel": 1, "fire": 1, "water": 1, "grass": 1, "electric": 1, "psychic": 1, "ice": 1, "dragon": 1, "dark": 1, "fairy": 1};
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var t = 0; t < types.length; t++)
  {
    var type = types[t];
    for(var x = 0; x < 18; x++)
    {
      var checkedType = typeList[x];
      if(typeChart[type]["2xFrom"].includes(checkedType))
      {
        dmgTable[checkedType] *= 2;
      }
      if(typeChart[type]["0.5xFrom"].includes(checkedType))
      {
        dmgTable[checkedType] /= 2;
      }
      if(typeChart[type]["0xFrom"].includes(checkedType))
      {
        dmgTable[checkedType] *= 0;
      }
    }
  }
  return dmgTable;
}

class MainComp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loadedData: [],
                  acMon: [],
                  queryText: ''};
  }

  setLoad(x)
  {
    this.setState({queryText: x});
  }

  setMon(x)
  {
    this.setState({acMon: x})
  }

  setQuery(x)
  {
    currentQuery = x
  }
  async get_data(i)
  {
    if(i > loaded_pkmn)
    {
      currently_loading++;
      loaded_pkmn++;
      var mon_data = await getData(i);
      
      data.push(mon_data);
      monForms[toString(mon_data[3])] = [];
      var v = Object.keys(mon_data[1].varieties)
      for(var iv = 1; iv < v.length; iv++)
      {
          if(Object.keys(form_whitelist).includes(toString(mon_data[3])) && !form_whitelist[mon_data[3]].includes(iv)){continue;}
          /**@type String */
          var fullName = mon_data[1].varieties[v[iv]]["pokemon"]["name"]
          var formName = fullName.replace(mon_data[0]["species"]["name"] + "-","")
          var path = "data/sprites/"+mon_data[3]+"/"+formName+"/front_default.png"
          var form_data_response = await fetch("data/api/"+mon_data[3]+"/"+formName+"/api.json").then((response) => response.json())
          var formObj = {
              name: titleCase(formName),
              img: path,
              data: form_data_response
          }
          monForms[toString(data[3])].push(formObj);
      }
      
      if(inSearch == false)
      {
        activeData = data;
      }
      
      var typeList = [];
      for(var tv = 0; tv < mon_data[0].types.length; tv++)
      {
        typeList.push(mon_data[0].types[tv].type.name);
      }
      damageFrom[i.toString()] = getDamageFromTable(typeList);
      console.log('added type data to ID',i.toString());

      currently_loading--;
      finished_loaded_pkmn++;
      this.forceUpdate();
    }
  }
  async load_data()
  {
    if(startedLoading)
    {
      return;
    }
    startedLoading = true;
    typeChart = await fetch("data/api/typechart.json").then((response) => response.json());
    console.log(typeChart);
    while(finished_loaded_pkmn < MAX_PKMN)
    {
      if(currently_loading < loadingScale && loaded_pkmn < MAX_PKMN)
      {
        this.get_data(loaded_pkmn+1);
      }
      else
      {
        await delay(1);
      }
      
    }
    console.log("dmgFrom:",damageFrom);
    data.sort(function(a, b){return a[3] - b[3]});
    this.forceUpdate();
  }
  

  activateOverlay(ID)
  {
    if(activeID == ID)
    {
      activeMon = [];
      activeID = 0;
      this.forceUpdate();
      return;
    }
    if(activeMon.length == 0)
    {
      var p = document.querySelector('.pokePanel');
      p.style.animationName = 'none';
      requestAnimationFrame(() => {p.style.animationName = ''});
    }
    activeID = ID;
    activeMon = [data[activeID-1]];
    this.forceUpdate();
  }

  setTab(tabID)
  {
    currentTab = tabID;
  }

  autosearch()
  {
    this.search(currentQuery);
  }

  

  search(query)
  {
    console.log("query:",query);
    activeData = analysis(query);
    if(activeData.length == data.length)
    {
      inSearch = false;
    }
    else
    {
      inSearch = true;
    }
    this.forceUpdate();
  }

  render()
  {
    if(startedLoading == false)
    {
      this.load_data();
    }
    
    if(inline_loaded != data.length)
    {
      this.setLoad(data);
      inline_loaded = data.length; 
    }
    var loadingText = <h3></h3>;
    if(loaded_pkmn < MAX_PKMN)
    {
      loadingText = <div><h3 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"50%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"50px", margin: "auto",zIndex: 11}}>Loading: {Math.round(100*loaded_pkmn/MAX_PKMN)}%</h3>
      <h6 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"57%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"0.8333333333vw", margin: "auto",zIndex: 11}}>(don't worry, it loads much, much faster the second time!)</h6></div>;
    }

    var toRender = [];
    if(loaded_pkmn >= MAX_PKMN)
    {
      toRender = activeData;
    }
    var pokeiconPanel = <p></p>;
    if(loaded_pkmn >= activeID && activeMon.length > 0)
    {
      var weaknesses = getWeaknesses(activeID);
      var resists = getResists(activeID);
      var immunities = getImmunities(activeID);

      if(weaknesses.length == 0)
      {
        weaknesses = [['none', -1]];
      }
      if(resists.length == 0)
      {
        resists = [['none', -1]];
      }
      if(immunities.length == 0)
      {
        immunities = [['none', -1]];
      }

      var pokestats = []
      var curmon = activeMon[0];
      for(var i = 0; i < 6; i++)
      {
        pokestats.push(curmon[0].stats[i].base_stat);
      }
      /** @type {Array} */
      var poketypes = curmon[0].types;
      var pokeabilities = curmon[0].abilities;
      pokeiconPanel = activeMon.map(mon => 
        <Item style={{display:"grid"}}>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "20%", paddingLeft:"5%", paddingRight: "5%"}} columns={3} row={1}>
          <Grid item style={{width:"100%", alignSelf:"center", height: "200px"}}> 
              <BarChart
              yAxis={[{ scaleType: 'band', data: statNameVals, max:225}]}
              xAxis={[{max:225}]}
              series={[{data: pokestats, color: "purple"}]}
              layout="horizontal"
              />
            </Grid>
          
          <Grid item style={{alignContent:"center", alignSelf:"center", display:"flex-grid", textAlign:"center"}}> 
                <Text style={{fontSize: "0.9375vw", color:("black")}}>Abilities:</Text>
                <br></br>
                {pokeabilities.map(pabl => 
                  <Text style={{fontSize: "0.9375vw", color:(pabl.is_hidden == false ? "black" : "#C8AE0F")}}>{splitTitleCase(pabl.ability.name) + "   "}</Text>
                  )}
            </Grid>
            
            <Grid item display={"grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
              <img src={process.env.PUBLIC_URL + mon[2]} style={{justifySelf: "center", imageRendering: "pixelated", width:"200%", alignSelf: "center", textAlign:"center", display:"grid"}} alt="pokemon data"></img>
              
            </Grid>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"}>
                <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{splitTitleCase(mon[0].name)}</b></Text></h1>
                <Text style={{fontSize: "12px", color:("black")}}>Type:</Text>
                <br style={{display:"block"}}></br>
                <div style={{margin:"0.5208333333vw", justifyContent: "center", display: "grid", gridAutoFlow: "column", columnWidth: "100%", gridGap: "0.5208333333vw", tableLayout: "fixed"}}>
                {poketypes.map(ptype => 
                  <Item style={{width: "6.25vw", alignSelf:"center", backgroundColor:typeColours[ptype.type.name]}}><Text style={{fontSize: "1.04166666667vw", color:"white"}}>{titleCase(ptype.type.name) + "  "}</Text>
                  <img style={{height:"1.04166666667vw"}} src={process.env.PUBLIC_URL + 'typeicons/'+ptype.type.name+'.png'}/></Item>
                  )}
                </div>
            </Grid>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} textAlign={"center"}>
                <Text style={{fontSize: "0.8333333333vw", color:("black")}}>Weaknesses:</Text>
                <br style={{display:"block"}}></br>
                <Grid container style={{margin:"0.5208333333vw", justifyContent: "center", display: "flex-grid", columnWidth: "50%", gridGap: "0.5208333333vw", tableLayout: "fixed", alignContent:"center"}}>
                {weaknesses.map(ptype => 
                  <Grid item><Item style={{width: "1.5625vw", height:"1.041666667vw", alignSelf:"center", backgroundColor:typeColours[ptype[0]], textAlign:"center", alignContent:"center"}}><img height={"100%"} src={process.env.PUBLIC_URL + 'typeicons/'+ptype[0]+'.png'}/></Item></Grid>
                  )}
                </Grid>
                <Text style={{fontSize: "0.8333333333vw", color:("black")}}>Resistances:</Text>
                <br style={{display:"block"}}></br>
                <Grid container style={{margin:"0.5208333333vw", justifyContent: "center", display: "flex-grid", columnWidth: "50%", gridGap: "0.5208333333vw", tableLayout: "fixed"}}>
                {resists.map(ptype => 
                  <Grid item><Item style={{width: "1.5625vw", height:"1.041666667vw", alignSelf:"center", backgroundColor:typeColours[ptype[0]], textAlign:"center", alignContent:"center"}}><img height={"100%"} src={process.env.PUBLIC_URL + 'typeicons/'+ptype[0]+'.png'}/></Item></Grid>
                  )}
                </Grid>
                <Text style={{fontSize: "0.8333333333vw", color:("black")}}>Immunities:</Text>
                <br style={{display:"block"}}></br>
                <Grid container style={{margin:"0.5208333333vw", justifyContent: "center", display: "flex-grid", columnWidth: "50%", gridGap: "0.5208333333vw", tableLayout: "fixed"}}>
                {immunities.map(ptype => 
                  <Grid item><Item style={{width: "1.5625vw", height:"1.041666667vw", alignSelf:"center", backgroundColor:typeColours[ptype[0]], textAlign:"center", alignContent:"center"}}><img height={"100%"} src={process.env.PUBLIC_URL + 'typeicons/'+ptype[0]+'.png'}/></Item></Grid>
                  )}
                </Grid>
            </Grid>
          </Grid>
      </Item>)
    }

    return (
      <div className="App" style={{display:"grid"}}>
        <form style={{display:"grid"}} onSubmit={event => {event.preventDefault(); this.autosearch()}}>
        <input style={{borderRadius: "1.041666667vw", zIndex:12, position: 'fixed', justifySelf: "center", borderWidth:"1px", width:"75%", margin:"auto", display:"block", transform: "translate(0px, 0.5208333333vw)", paddingLeft: "1.041666667vw", fontFamily: "bwFont"}}
        type="text" placeholder='enter search (i.e type=fire atk>120)' onChange={event => {this.setQuery(event.target.value)}}/>
        </form>
        {loadingText}
        <div className='pokePanel' fontFamily={"bwFont"} style={{zIndex: 10}}>
          {pokeiconPanel}
        </div>
        <br></br>
        <h2 style={{textAlign: "center", fontFamily:"bwFont"}}>PokéSearch</h2>
        <body>
        <Grid container spacing={1}>
          {toRender.map(poke => 
          
          <Grid item xs={4} sm={2} md={1.5} lg={1} key={poke[3]} className='hover-style'>
            <Item style={{}} className='load-style' onClick={this.activateOverlay.bind(this, poke[3])}>
            <img src={process.env.PUBLIC_URL + poke[2]} style={{alignContent: "center", imageRendering: "pixelated"}} alt="pokemon data"></img>
            </Item>
          </Grid>
          )}
        </Grid>
        </body>
      </div>
    );
  }
}


async function getData(ID)
{
  try
  {
    var response = await fetch("data/api/"+ID+"/api.json").then((response) => response.json());
    var spec_response = await fetch("data/api/"+ID+"/species.json").then((response) => response.json())
    var spriteURL = "data/sprites/"+ID+"/front_default.png"
    var data = response;
    var spec_data = spec_response;
    return [data, spec_data, spriteURL, ID];
  }
  catch(e)
  {
    console.log(e);
  }
  
}

function titleCase(/**@type String */str)
{
    /**@type String */
    var base = str.toLowerCase()
    return base.charAt(0).toUpperCase() + base.slice(1);
}

function splitTitleCase(/**@type String */str)
{
    var parts = str.split("-");
    var final = ""
    for(var i = 0; i < parts.length; i++)
    {
        final += titleCase(parts[i]);
        if(i < parts.length - 1)
        {
            final += " ";
        }
    }
    return final;
}

function analysis(searchQuery)
{
    var chosenData = []
    if(searchQuery == "")
    {
        chosenData = data;
    }
    else
    {
        var tempList = []
        var args = searchQuery.trimEnd().trimStart().split(" ");
        for(var i = 0; i < args.length; i++)
        {
            tempList = tempList.concat(evaluateArgument(args[i], data, monForms, damageFrom));
        }
        var endList = []
        if(tempList.length == 0)
        {
            endList = data;
        }
        else
        {
            var sortMode = "AND"
            switch(sortMode)
            {
                case "OR":
                    endList = [...new Set(tempList)];
                    break;
                case "AND":
                    var counts = {};
                    var names = {};

                    for (var i = 0; i < tempList.length; i++) 
                    {
                        var ic = tempList[i];
                        console.log("ic: ",ic);
                        counts[ic[0].name] = counts[ic[0].name] ? counts[ic[0].name] + 1 : 1;
                        names[ic[0].name] = ic;
                        console.log(counts[ic[0].name]);
                    }
                    console.log(counts);
                    var keys = Object.keys(counts);
                    for(var c = 0; c < keys.length; c++)
                    {
                        var k = keys[c];
                        console.log(k + ": " + counts[k])
                        if(counts[k] == args.length){endList.push(names[k]);}
                    }
                    break;
                  default:
                    break;
            }
            
        }
        chosenData = endList;
    }
    return chosenData;
}

function pokeSprite(ID)
{
  return "data/sprites/"+ID+"/front_default.png";
}







function pokeIcon(ID)
{
  var pokedata = data[ID]
  return (
  <Grid item xs={2} sm={4} md={4} key={ID} id={ID}>
    <Item><img src={process.env.PUBLIC_URL + pokedata[2]} style={{alignContent: "center"}} alt="pokemon data" key={ID}></img>{titleCase(pokedata[0].name)}</Item>
  </Grid>
  );
}

class LiveGrid extends React.Component {
  constructor(props) {
      super(props)
      this.state = { maxLoad: 0};
  }

  updateGrid = () => {

    this.setState({maxLoad: loaded_pkmn});

  }

render() {
    
  return (
    <Grid container spacing={1}>
    {data.map(poke => 
    <Grid item xs={1} sm={4} md={1.5}>
      <Item>
      <img src={process.env.PUBLIC_URL + poke[2]} style={{alignContent: "center"}} alt="pokemon data"></img>
      <h3 style={{textAlign: "center"}}>{titleCase(poke[0].name)}</h3>
      </Item>
    </Grid>)}
  </Grid>
  )
}
}



var data = []




function App()
{
  return(<MainComp/>);
}



export default App;
