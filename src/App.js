import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { BarChart } from '@mui/x-charts/BarChart';
import {PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import {Gauge} from '@mui/x-charts/Gauge';
import {useSpring, animated} from 'react-spring';
import { alignProperty } from '@mui/material/styles/cssUtils';
import {Text} from 'react-native';
import { evaluateArgument } from './data_analysis';
import { type } from '@testing-library/user-event/dist/type';
import Fade from '@mui/material/Fade';
import {Dex} from '@pkmn/dex';
import {Generations} from '@pkmn/data';
import {Smogon} from '@pkmn/smogon';
import { hover } from '@testing-library/user-event/dist/hover';

//copied from data_analysis
var operators = 
{
    "name":"checkName",

    "type":"checkType",

    "color":"checkCol",
    "colour":"checkCol",

    "weight":"checkWeight",

    "hp":"checkHP",

    "atk":"checkAtk",

    "def":"checkDef",

    "spa":"checkSpA",

    "spd":"checkSpD",

    "spe":"checkSpe",
    "speed":"checkSpe",

    "bst":"checkBST",
    "basestattotal":"checkBST",
    "base_stat_total":"checkBST",

    "capture":"checkCR",
    "capturerate":"checkCR",
    "capture_rate":"checkCR",

    "forms":"checkForms",

    "gen":"checkGeneration",

    "id":"checkID",
    "natdex":"checkID",

    "learns":"checkLearnset",

    "weakness":"checkWeakness",
    "weak":"checkWeakness",

    "resistance":"checkResist",
    "resists":"checkResist",
    "resist":"checkResist",

    "neutral":"checkNeutral",

    "immunity":"checkImmune",
    "immune":"checkImmune"
}

function desc()
{
    return {
        "checkName":"The name of the Pokemon's default form (i.e: name = pikachu, name = zoroark, name = dunsparce)",
        "checkType":"The elemental type(s) of the Pokemon (i.e: type = ground, type = dragon)",
        "checkCol":"The internally specified colour of the Pokemon (i.e: color = purple)",
        "checkWeight":"The internally specified weight of the Pokemon (i.e: weight = 300, weight < 100)",
        "checkHP":"The base stat for the Pokemon's HP stat",
        "checkAtk":"The base stat for the Pokemon's ATTACK stat",
        "checkDef":"The base stat for the Pokemon's DEFENSE stat",
        "checkSpA":"The base stat for the Pokemon's SPECIAL ATTACK stat",
        "checkSpD":"The base stat for the Pokemon's SPECIAL DEFENSE stat",
        "checkSpe":"The base stat for the Pokemon's SPEED stat",
        "checkBST":"The base stat total of a Pokemon (The sum of all of its base stats for HP, Atk, SpA, Def, SpD, Spe)",
        "checkCR":"The capture rate of a Pokemon (i.e: capture = 3, capture < 255)",
        "checkForms":"The number of forms a Pokemon has (Including its default form) (i.e forms > 3)",
        "checkGeneration":"The generation of mainline Pokemon games that the Pokemon was introduced in (i.e: gen = 1, gen > 5, gen < 8)",
        "checkID":"The national dex number of the Pokemon (i.e: id = 1, id > 76, id < 904)",
        "checkLearnset":"The learnset of a Pokemon. Checks if equated move is in the learnset (i.e learns = rock-throw)",
        "checkWeakness":"Check if the Pokemon is weak to the equated type (i.e weak = fire)",
        "checkResist":"Check if the Pokemon resists the equated type (i.e resist = water)",
        "checkNeutral":"Check if the Pokemon is not weak to AND does not resist the equated type (i.e neutral = grass)",
        "checkImmune":"Check if the Pokemon is immune to the equated type (i.e immune = electric)"
    }
}

function getOperators()
{
    return operators
}



const gens = new Generations(Dex);
console.log(getOperators());
var desc_keys = Object.keys(getOperators());
var operator_desc = {}
var desc_ops = getOperators();

var sorted_icons = false
const fetch = window.fetch.bind(window);
var offset_data = await fetch("data/sprites/offset_data.json").then((response) => response.json())
console.log("offset data",offset_data["1"][0])
console.log(fetch);
const smogon = new Smogon(fetch);

const MAX_PKMN = 1025;

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const loadImage = path => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
    img.src = path
    img.onload = () => {
      resolve(img)
    }
    img.onerror = e => {
      reject(e)
    }
  })
}

const vgcformat = 'gen9vgc2023';
var typeChart;
var helpStyle = ["block"];
if(window.mobileCheck())
{
  helpStyle = ["none"];
}
var currentTab = 0;
var loadingScale = 50;
var currentTab = 0;
var currently_loading = 0;
var loaded_pkmn = 0;
var finished_loaded_pkmn = 0;
var inline_loaded = 0;
var startedLoading = false;
var activeID = 1;
var currentForm = 1;
var activeMon = [];
var monForms = {};
var inSearch = false;
var helpMenu = false;
var activeData = [];
var pokeStats= [];
var nameToID = {}
var nameToIMG = {}
var nameToComp = {}
var statNames = {
  'hp':'HP',
  'attack':'Atk',
  'defense':'Def',
  'special-attack':'SpA',
  'special-defense':'SpD',
  'speed':'Spe'
}
var nameLinks = {
  'keldeo-ordinary': 'keldeo',
  'keldeo-ordinary-resolute': 'keldeo-resolute'
}
var pokegifs = {}
var addedgifs = {}
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
var typeColourList = Object.keys(typeColours);
typeColourList.splice(typeColourList.indexOf('none'), 1);
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
    "20": [1],
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
var hovering_over = 0

var smogon_tiers = 
{
    "gen1":["ou","uu","nu","ubers"],
    "gen2":["ou","uu","nu","ubers"],
    "gen3":["ou","uu","nu","ubers"],
    "gen4":["ou","uu","nu","ubers","lc"],
    "gen5":["ou","uu","ru","nu","ubers","lc"],
    "gen6":["ou","uu","ru","nu","pu","ubers","lc"],
    "gen7":["ou","uu","ru","nu","pu","ubers","lc"],
    "gen8":["ou","uu","ru","nu","pu","ubers","lc"],
    "gen9":["ou","uu","ru","nu","pu","ubers","lc"]
}

//"operator" = [[valid comparators], [valid names]]
var randomOperatorSheet = 
{
    "type":[["="],typeColourList],

    "color":[["="],["red","blue","green","black","white","purple","pink","yellow"]],

    "weight":[[">","<"],numberRange(500, 10)],

    "hp":[[">","<"],numberRange(150, 50)],

    "atk":[[">","<"],numberRange(150, 50)],

    "def":[[">","<"],numberRange(150, 50)],

    "spa":[[">","<"],numberRange(150, 50)],

    "spd":[[">","<"],numberRange(150, 50)],

    "spe":[[">","<"],numberRange(150, 50)],

    "bst":[[">","<"],[350,400,450,500,510,520,530,540,550,560,570,580,590,600]],

    "gen":[[">","=","<"],[1,2,3,4,5,6,7,8,9]],

    "natdex":[[">","<"], [400,500,600,700]],

    "learns":[["="],["tackle","shadow-ball","flamethrower","grass-knot","thunderbolt","earthquake"]],

    "weakness":[["="],typeColourList],

    "resist":[["="],typeColourList],

    "immune":[["="],["normal","fighting","ghost","psychic","poison","ground","electric"]]
}

const linkDict = 
{

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

const TabItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}));
var usageTable = {}

function numberRange(endAt, startAt = 0) {
  var size = endAt - startAt;
  return [...Array(size).keys()].map(i => i + startAt);
}

async function getUsage(p_name)
{
  for(var generation = 1; generation <= 9; generation++)
  {
    var pokename = p_name;
    var usage_key = pokename + " - " + generation.toString();
    if(generation == 8)
    {
      pokename = p_name.replace("-gmax","");
    }
    var usageData = await smogon.stats(gens.get(generation), pokename);
    usageTable[usage_key] = usageData;
    
  }
  var vgc_key = pokename + " - " + generation.toString() + " - vgc";
  var vgcData = await smogon.stats(gens.get(9), p_name, vgcformat);
  usageTable[vgc_key] = vgcData;
  if(vgcData != null)
  {
    console.log("added vgc data for " + pokename + ":",vgcData);
  } 
}

function grabUsage(pokename, generation)
{
  var usage_key = pokename + " - " + generation.toString();
  console.log(usageTable);
  return usageTable[usage_key]; 
}

function getOffset(pokeID, index)
{
  if(pokeID == hovering_over && pokeID.toString() in pokegifs && pokeID.toString() in offset_data)
  {
    return offset_data[pokeID.toString()][index]
  }
  else
  {
    return 0
  }
}



function getWeaknesses(ID, formID)
{
  var weak = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][formID][type] >= 2)
    {
      weak.push([type, damageFrom[ID][formID][type]]);
    }
  }
  return weak;
}

function getResists(ID, formID)
{
  var res = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][formID][type] < 1 && damageFrom[ID][formID][type] > 0)
    {
      res.push([type, damageFrom[ID][formID][type]]);
    }
  }
  return res;
}

function getImmunities(ID, formID)
{
  var imm = []
  var typeList = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  for(var i = 0; i < 18; i++)
  {
    var type = typeList[i];
    if(damageFrom[ID][formID][type] == 0)
    {
      imm.push([type, damageFrom[ID][formID][type]]);
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
                  queryText: ''
                };
            
    var i_w = 0
    while(i_w < desc_keys.length)
    {
      var d_0 = desc_keys[i_w - 1]
      var d_1 = desc_keys[i_w]
      if(desc_ops[d_0] == desc_ops[d_1])
      {
        desc_keys.splice(desc_keys.indexOf(d_1), 1);
        i_w--;
      }
      i_w++;
    }
    for(var i = 0; i < desc_keys.length; i++)
    {
      operator_desc[desc_keys[i]] = desc()[desc_ops[desc_keys[i]]];
    }
    console.log("operator desc:",operator_desc);
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

      var typeList = [];
      for(var tv = 0; tv < mon_data[0].types.length; tv++)
      {
        typeList.push(mon_data[0].types[tv].type.name);
      }
      
      data.push(mon_data);
      monForms[mon_data[3].toString()] = [
        {
              name: "Base",
              img: mon_data[2],
              data: mon_data[0]
          }
      ];
      damageFrom[i.toString()] = []
      damageFrom[i.toString()].push(getDamageFromTable(typeList));
      var v = Object.keys(mon_data[1].varieties)
      for(var iv = 1; iv < v.length; iv++)
      {
          if(mon_data[3] in form_whitelist && !form_whitelist[mon_data[3]].includes(iv))
          {
            continue;
          }
          if(Object.keys(form_whitelist).includes(toString(mon_data[3])) && !form_whitelist[mon_data[3]].includes(iv)){continue;}
          /**@type String */
          var fullName = mon_data[1].varieties[v[iv]]["pokemon"]["name"]
          var formName = fullName.replace(mon_data[0]["species"]["name"] + "-","")
          var path = "data/sprites/"+mon_data[3]+"/"+formName+"/front_default.png"
          var form_data_response = await fetch("data/api/"+mon_data[3]+"/"+formName+"/api.json").then((response) => response.json())
          var formObj = {
              name: titleCase(formName),
              fullname: fullName,
              img: path,
              data: form_data_response
          }
          getUsage(fullName, 9);
          this.addNameToCompName(fullName);
          this.addNameToID(mon_data, fullName);
          console.log("added alt form " + fullName + " to images");
          this.addNameToIMG(path, fullName);
          
          var form_typeList = [];
          for(var tv = 0; tv < form_data_response.types.length; tv++)
          {
            form_typeList.push(form_data_response.types[tv].type.name);
          }
          console.log(form_typeList);
          damageFrom[i.toString()].push(getDamageFromTable(form_typeList));
          monForms[mon_data[3].toString()].push(formObj);
      }
      
      if(inSearch == false)
      {
        activeData = data;
      }
      
      
      
      console.log('added type data to ID',i.toString());
      getUsage(mon_data[0].name);
      this.addNameToCompName(mon_data[0].name);
      this.addToID(mon_data);
      this.addNameToIMG(mon_data[2], mon_data[0].name);
      this.addNameToIMG(mon_data[2], mon_data[1].name);
      
      currently_loading--;
      finished_loaded_pkmn++;
      this.forceUpdate();
    }
  }

  async addToID(mon_data)
  {
    this.addNameToID(mon_data, mon_data[0].name);
  }
  async addNameToID(mon_data, name)
  {
    nameToID[name] = mon_data[3];
    nameToID[nameToComp[name]] = mon_data[3];
    if(name.toLowerCase().startsWith("arceus"))
    {
      var types = typeColourList;
      for(var i = 0; i < types.length; i++)
      {
        nameToID[name+"-"+types[i]] = mon_data[3]; 
      }
    }
    console.log("id process for",name);
    if(name.toLowerCase().endsWith("-incarnate"))
    {
      nameToID[name.replaceAll("-incarnate","")] = mon_data[3];
      console.log(name.replaceAll("-incarnate",""),"=",mon_data[3]);
    }
  }
  async addNameToIMG(img_path, name, base = false)
  {
    nameToIMG[name] = img_path;
    nameToIMG[nameToComp[name]] = img_path;
    if(name.toLowerCase().startsWith("arceus"))
    {
      var types = typeColourList;
      for(var i = 0; i < types.length; i++)
      {
        nameToIMG[name+"-"+types[i]] = img_path; 
      }
      
    }
  }
  addNameToCompName(name, base = false)
  {
    
    if(name.toLowerCase().startsWith("ogerpon"))
    {
      nameToComp[name] = name.replaceAll("-mask",""); 
      return;
    }

    if(name.toLowerCase().startsWith("tauros-paldea"))
    {
      nameToComp[name] = name.replaceAll("-breed", ""); 
      console.log("exception for",name.replaceAll("-breed", ""));
      return;
    }

    if(name.toLowerCase().startsWith("necrozma-"))
    {
      nameToComp[name] = name.replaceAll("-mane", ""); 
      return;
    }

    
    nameToComp[name] = name;
  }
  async setHelpStyle(val)
  {
    helpStyle = [val];
    this.forceUpdate();
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
    sorted_icons = true;
    var query = randomQuery();
    this.forceQuery(query);
    this.autosearch();
    this.forceUpdate();
  }

  setActiveForm(formNum)
  {
    currentForm = formNum;
    this.forceUpdate();
  }

  forceQuery(x)
  {
    document.getElementById("pokesearchbar").value = x;
    this.setQuery(x);
  }
  

  activateOverlay(ID)
  {
    if(window.mobileCheck())
    {
      return;
    }
    if(activeID == ID)
    {
      activeMon = [];
      activeID = 0;
      currentForm = 0;
      this.setTab(0);
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
    currentForm = 0;
    this.setTab(0);
    this.forceUpdate();
  }

  setTab(tabID)
  {
    currentTab = tabID;
    this.forceUpdate();
  }

  autosearch()
  {
    this.activateOverlay(activeID);
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

  setMouseOver(id)
  {
    hovering_over = id
    this.forceUpdate()
  }

  resetMouseOver()
  {
    hovering_over = 0
    this.forceUpdate()
  }

  async addToGIFS(ID)
  {
    if(ID >= 650 || (ID.toString() in addedgifs))
    {
      return; 
    }
    addedgifs[ID.toString()] = true;
    var p = "data/sprites/"+ID+"/generation-v/front_default.gif"
    var p_png = "data/sprites/"+ID+"/front_default.png"
    var dx = 0
    var dy = 0

    var gif_img = await loadImage(p);
    var png_img = await loadImage(p_png);
    
    dx = png_img.width - gif_img.width
    dy = png_img.height - gif_img.height
    pokegifs[ID.toString()] = [p, dx, dy];
    this.forceUpdate()
  }
  setHelp(val)
  {
    helpMenu = val;
    this.forceUpdate(); 
  }
  internalPokeGIF(ID, index)
  {
    if(hovering_over != ID || ID >= 650)
    {
      return ["data/sprites/"+ID+"/front_default.png", 0, 0][index];
    }

    if((ID.toString() in pokegifs) == false)
    {
      this.addToGIFS(ID);
      return ["data/sprites/"+ID+"/front_default.png", 0, 0][index];
    }
    else
    {
      console.log("deltas:",pokegifs[ID.toString()]);
      return pokegifs[ID.toString()][index];
    }
  }

  render()
  {
    
    if(startedLoading == false)
    {
      this.load_data();
    }

    var loadingText = <h3></h3>;
    if(loaded_pkmn < MAX_PKMN)
    {
      var botText = "(don't worry, it loads much, much faster the second time!)"
      if(window.mobileCheck())
      {
        botText = "";
      }
      loadingText = <div><h3 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"50%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"50px", margin: "auto",zIndex: 11}}>Loading: {Math.round(100*loaded_pkmn/MAX_PKMN)}%</h3>
      <h6 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"57%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"0.8333333333vw", margin: "auto",zIndex: 11}}>{botText}</h6></div>;
    }
    else if(!sorted_icons)
    {
      var botText = "(this shouldn't take too long)"
      if(window.mobileCheck())
      {
        botText = "";
      }
      loadingText = <div><h3 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"50%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"50px", margin: "auto",zIndex: 11}}>Sorting Pokemon</h3>
      <h6 style={{textAlign: "center", alignContent:"center",justifyContent:"center",position: "fixed", top:"57%", left:"50%",transform:"translate(-50%, -50%)", fontSize:"0.8333333333vw", margin: "auto",zIndex: 11}}>{botText}</h6></div>;
    }

    var helpMenu = <h3></h3>
    var noResults = <h3/>
    var toRender = [];
    if(loaded_pkmn >= MAX_PKMN && sorted_icons)
    {
      toRender = activeData;
      if(activeData.length <= 0)
      {
        var helptxt = "Try a different search"
        if(currentQuery == "")
        {
          helptxt = 'If you want to see all '+MAX_PKMN.toString()+' Pokémon, enter "all" into the search bar'
        }
        noResults = (<div>
          <Text style={{fontSize: "3vw", textAlign:"center",justifyContent:"center",alignContent:"center", alignSelf: "center"}}><b>No Results</b></Text><br/>
        <Text style={{fontSize: "vw", textAlign:"center",justifyContent:"center",alignContent:"center", alignSelf: "center"}}>({helptxt})</Text>
        </div>
      )
      }
    }
    
    var pokeiconDropdown = <p></p>;
    var pokeiconPanels = []
    var pokeiconTabs = <p></p>;

    var tabList = [
      {
        icon: process.env.PUBLIC_URL + 'pokeball.png',
        name: "Overview",
        tabID: 0
      },
      {
        icon: process.env.PUBLIC_URL + 'premball.png',
        name: "Learnset",
        tabID: 1
      },
      {
        icon: process.env.PUBLIC_URL + 'specball.png',
        name: "Move Usage",
        tabID: 2
      },
      {
        icon: process.env.PUBLIC_URL + 'data/items/sprites/leftovers/leftovers.png',
        name: "Item Usage",
        tabID: 3
      },
      {
        icon: process.env.PUBLIC_URL + 'data/items/sprites/eject-button/eject-button.png',
        name: "Counters",
        tabID: 4
      },
      {
        icon: process.env.PUBLIC_URL + 'data/items/sprites/gold-bottle-cap/gold-bottle-cap.png',
        name: "Teammates",
        tabID: 5
      }
    ]

    var renderPanel = false;
    if(loaded_pkmn >= activeID && activeMon.length > 0)
    {
      renderPanel = true;
      var pokename = activeMon[0][0].name;
      
      var displayname = activeMon[0][1].name;
      currentForm = Math.min(currentForm, monForms[activeMon[0][3].toString()].length - 1)
      var curmon = monForms[activeMon[0][3].toString()][currentForm];
      var otherforms = [];
      for(var v = 0; v < monForms[activeMon[0][3].toString()].length; v++)
      {
        if(v != currentForm)
        {
          otherforms.push([monForms[activeMon[0][3].toString()][v], v]);
        }
      }
      console.log(otherforms);
      var hasForms = otherforms.length > 0;
      var pokeformname = "";
      if(currentForm > 0)
      {
        pokeformname = monForms[activeMon[0][3].toString()][currentForm].name;
        console.log("form name:", pokeformname);
      }
      var pokemoves = monForms[activeMon[0][3].toString()][currentForm].data.moves;
      console.log(pokemoves);

      var weaknesses = getWeaknesses(activeID, currentForm);
      var resists = getResists(activeID, currentForm);
      var immunities = getImmunities(activeID, currentForm);

      var compData = null;
      var moveUsage = [];
      var itemUsage = [];
      var counters = [];
      var teammates = [];
      var compIterations = [];
      var compName = pokename;
      if(currentForm > 0)
      {
        compName = monForms[activeMon[0][3].toString()][currentForm].fullname;
      }
      compName = nameToComp[compName];
      console.log("comp name:",compName, monForms[activeMon[0][3].toString()][currentForm]);
      var chosenGen = 9;
      compData = null;
      while(compData == null && chosenGen >= 1)
      {
        compData = grabUsage(compName, chosenGen);
        chosenGen--;
      }
      chosenGen++;
      console.log("comp data:", compData);
      if(compData != null)
      {
        compIterations.push(0);
        var moveKeys = Object.keys(compData.moves);
        for(var m = 0; m < moveKeys.length; m++)
        {
          moveUsage.push({id:m, value:(100*compData.moves[moveKeys[m]]).toFixed(2), label: moveKeys[m]});
        }
        console.log("move usage:",moveUsage);
        var itemKeys = Object.keys(compData.items);
        for(var m = 0; m < itemKeys.length; m++)
        {
          var itemName = itemKeys[m].toLowerCase().replace(" ","-");
          if(itemName.endsWith("-z"))
          {
            itemName += "--held";
          }
          itemUsage.push({id:m, value:(100*compData.items[itemKeys[m]]).toFixed(2), label: itemKeys[m], img: (process.env.PUBLIC_URL + "/data/items/sprites/"+itemName+"/"+itemName+".png")});
        }
        console.log("item usage:",itemUsage);
        var counterKeys = Object.keys(compData.counters);
        for(var m = 0; m < counterKeys.length; m++)
        {
          var counterName = counterKeys[m].toLowerCase().replace(" ","-");
          var effectivenessRating = Math.sqrt(Math.pow(2*compData.counters[counterKeys[m]][1], 2) + Math.pow((1/2.0)*compData.counters[counterKeys[m]][2],2))/Math.sqrt(2*2 + (1/2)*(1/2));
          counters.push({id:m, 
            value:(100*effectivenessRating).toFixed(2), 
            label: counterKeys[m], 
            img: (process.env.PUBLIC_URL + nameToIMG[counterName]),
            p: compData.counters[counterKeys[m]][1],
            d: compData.counters[counterKeys[m]][2]
          });
        }
        console.log("counters:",counters);

        var teammateKeys = Object.keys(compData.teammates);
        for(var m = 0; m < teammateKeys.length; m++)
        {
          if(compData.teammates[teammateKeys[m]] < 0.1){continue;}
          var teammateName = teammateKeys[m].toLowerCase().replace(" ","-");
          teammates.push({id:m, 
            value:(100*compData.teammates[teammateKeys[m]]).toFixed(2), 
            label: teammateKeys[m], 
            img: (process.env.PUBLIC_URL + nameToIMG[teammateName]),
            p: compData.teammates[teammateKeys[m]][1],
            d: compData.teammates[teammateKeys[m]][2]
          });
        }
        console.log("teammates:",teammates);
      }

      if(teammates.length == 0)
      {
        tabList.splice(4);
      }
      if(counters.length == 0)
      {
        tabList.splice(4);
      }
      if(itemUsage.length == 0)
      {
        tabList.splice(3);
      }
      if(moveUsage.length == 0)
      {
        tabList.splice(2);
      }

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
      
      var prefix = "";
      var suffix = "";
      if(currentForm > 0)
      {
        var full = (curmon.name).split("-");
        prefix = full[0] + "-";
        suffix = "";
        for(var sf = 1; sf < full.length; sf++)
        {
          suffix += full[sf];
          if(sf < full.length - 1)
          {
            suffix += " ";
          }
        }
      }
      var pokeimg = curmon.img;
      console.log("curmon:",curmon);
      for(var i = 0; i < 6; i++)
      {
        pokestats.push(curmon.data.stats[i].base_stat);
      }
      /** @type {Array} */
      var poketypes = curmon.data.types;
      var pokeabilities = curmon.data.abilities;
      var pokeOverview = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "133%" : "100%")}} className='underPanel'>
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
            
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"} style={{whiteSpace:'nowrap'}}>
              <img src={process.env.PUBLIC_URL + pokeimg} style={{justifySelf: "center", imageRendering: "pixelated", width:"100%", alignSelf: "center", textAlign:"center", display:"grid"}} alt="pokemon data"></img>
              <nobr><div style={{gridAutoFlow:"column", display:"grid", columnWidth:"30%"}}>
              {otherforms.map(pform => 
                <Grid item style={{padding:"5px", width:"100%"}}><Item className='hover-style' style={{alignContent:"center", justifyContent: "center", display:"grid"}} key={pform[1]} onClick={this.setActiveForm.bind(this, Number(pform[1]))}>
                <img src={process.env.PUBLIC_URL + pform[0].img} style={{justifySelf: "center", imageRendering: "pixelated", alignSelf: "center", textAlign:"center", display:"grid", width:"100%"}} alt="pokemon data"></img>
                </Item></Grid>
                )}
              </div></nobr>
            </Grid>
            
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"}>
                <Text style={{ fontSize: "1.666666667vw"}}><b>{splitTitleCase(displayname)}</b></Text><br style={{display:"block", margin:"0em"}}/><Text style={{ fontSize: "1vw"}}><b>{pokeformname}</b></Text>
                <br style={{display:"block", margin:"0em"}}/>
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
      var pokeLearnset = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "133%" : "100%")}} className='underPanel'>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{"Learnset for " + splitTitleCase(prefix + displayname + "-" + suffix)}</b></Text><br/></h1>
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "50%", paddingLeft:"5%", paddingRight: "5%"}} columns={3} row={1}>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                <Grid container width={"100%"} display={"grid"} height={"300px"} paddingLeft={"5%"} style={{overflowY: "scroll", overflowX: "hidden", height: "200px", lineHeight:"10px"}}>
                  {pokemoves.map(pokemove => 
                  <Grid item width={"100%"} display={"grid"}><Item width={"100%"} display={"grid"}>
                  <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "0.7vw"}}>{splitTitleCase(pokemove.move.name)}</Text></h1>

                  </Item></Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
      </Item>)
      var pokeMoveUsage = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "150%" : "150%")}} className='underPanel'>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{"Moveset Data for " + splitTitleCase(prefix + displayname + "-" + suffix) + " (Smogon Singles, Gen " + chosenGen + ")"}</b></Text></h1>
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "50%", paddingLeft:"5%", paddingRight: "5%", height:"100%"}} columns={3} row={1}>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                <Grid container width={"100%"} display={"grid"} paddingLeft={"5%"} style={{overflowY: "scroll", overflowX: "hidden", height:"40vh"}}>
                  <div style={{height: "400px"}}>
                  {moveUsage.map(itr =>
                    <Grid item><Item><Text>{itr.label}: {itr.value}%</Text></Item></Grid>
                  )}
                  </div>
              </Grid>
            </Grid>
            <Grid item style={{width:"100%", height:"40vh",alignSelf:"center", display:"flex-grid", alignContent:"center", justifyContent:"center"}}>
                <PieChart
                  series={[{data: moveUsage, arcLabelMinAngle: 45, highlightScope: { faded: 'global', highlighted: 'item'}}]}
                  slotProps={{
                    legend: {
                      hidden: true
                    }
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                                  />
            </Grid>
          </Grid>
      </Item>)
      var pokeItemUsage = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "150%" : "150%")}} className='underPanel'>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{"Item Usage Data for " + splitTitleCase(prefix + displayname + "-" + suffix) + " (Smogon Singles, Gen " + chosenGen + ")"}</b></Text></h1>
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "50%", paddingLeft:"5%", paddingRight: "5%", height:"100%"}} columns={3} row={1}>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                <Grid container width={"100%"} display={"grid"} paddingLeft={"5%"} style={{overflowY: "scroll", overflowX: "hidden", height:"40vh"}}>
                  <div style={{height: "400px"}}>
                  {itemUsage.map(itr =>
                    <Grid item><Item style={{display:"grid", alignContent:"center"}}><img src={itr.img} style={{height:"100%", imageRendering:"pixelated"}}/><Text>{itr.label}: {itr.value}%</Text></Item></Grid>
                  )}
                  </div>
              </Grid>
            </Grid>
            <Grid item style={{width:"100%", height:"40vh",alignSelf:"center", display:"flex-grid", alignContent:"center", justifyContent:"center"}}>
                <PieChart
                  series={[{data: itemUsage, arcLabelMinAngle: 45, highlightScope: { faded: 'global', highlighted: 'item'}}]}
                  slotProps={{
                    legend: {
                      hidden: true
                    }
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                                  />
            </Grid>
          </Grid>
      </Item>)
      var pokeCounters = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "150%" : "150%")}} className='underPanel'>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{"Checks/Counters for " + splitTitleCase(prefix + displayname + "-" + suffix) + " (Smogon Singles, Gen " + chosenGen + ")"}</b></Text></h1>
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "50%", paddingLeft:"5%", paddingRight: "5%", height:"100%"}} columns={3} row={1}>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                <Grid container width={"100%"} display={"grid"} paddingLeft={"5%"} style={{overflowY: "scroll", overflowX: "hidden", height:"40vh"}}>
                  <div style={{height: "400px"}}>
                  {counters.map(itr =>
                    <Grid item><Item className='hover-style' onClick={this.activateOverlay.bind(this,nameToID[itr.label.toLowerCase().replace(" ", "-")])} style={{display:"grid", alignContent:"center"}}>
                      <Grid container style={{display:"grid", gridAutoFlow:"column", columnWidth:"50%"}}>
                        <Grid item style={{display:"grid"}}><img src={itr.img} style={{height:"100%", imageRendering:"pixelated"}}/><Text style={{fontSize: "16px"}}>{itr.label}</Text><br/></Grid>
                        <Grid item style={{display:"grid"}}><Text style={{fontSize: "12px"}}>Effectiveness Rating:</Text><br/>
                          <Gauge width={100} height={100} value={itr.value} valueMax={60}/>
                        </Grid>
                      </Grid>
                    </Item></Grid> //ER = Effectiveness Rating
                  )}
                  </div>
              </Grid>
            </Grid>
          </Grid>
      </Item>)
      var pokeTeammates = activeMon.map(mon => 
        <Item style={{display:"grid", maxHeight:(hasForms ? "150%" : "150%")}} className='underPanel'>
          <Item style={{width:"5%", justifySelf: "right"}} className='button-style' fontFamily="bwFont" onClick={this.activateOverlay.bind(this, activeID)}>Close</Item>
          <h1 fontFamily={"bwFont"}><Text style={{ fontSize: "1.666666667vw"}}><b>{"Common Teammates for " + splitTitleCase(prefix + displayname + "-" + suffix) + " (Smogon Singles, Gen " + chosenGen + ")"}</b></Text></h1>
          <h5 fontFamily={"bwFont"}><Text style={{ fontSize: "0.7vw"}}><b>{"Note: Only usages more than or equal to 10% are shown, so percentages will not total to any standard value"}</b></Text></h5>
          <Grid container style={{justifyContent: "center", width:"100%", display:"grid", gridAutoFlow: "column", gridAutoRows: "max-content", gridAutoColumns: "50%", paddingLeft:"5%", paddingRight: "5%", height:"100%"}} columns={3} row={1}>
            <Grid item display={"flex-grid"} justifyContent={"center"} alignContent={"center"} width={"100%"}>
                <Grid container width={"100%"} display={"grid"} paddingLeft={"5%"} style={{overflowY: "scroll", overflowX: "hidden", height:"40vh"}}>
                  <div style={{height: "400px"}}>
                  {teammates.map(itr =>
                    <Grid item><Item style={{display:"grid", alignContent:"center"}} onClick={this.activateOverlay.bind(this,nameToID[itr.label.toLowerCase().replace(" ", "-")])} className='hover-style'
                    ><img src={itr.img} style={{height:"100%", imageRendering:"pixelated"}}/><Text>{itr.label}: {itr.value}%</Text></Item></Grid>
                  )}
                  </div>
              </Grid>
            </Grid>
            <Grid item style={{width:"100%", height:"40vh",alignSelf:"center", display:"flex-grid", alignContent:"center", justifyContent:"center"}}>
                <PieChart
                  series={[{data: teammates, arcLabelMinAngle: 45, highlightScope: { faded: 'global', highlighted: 'item'}}]}
                  slotProps={{
                    legend: {
                      hidden: true
                    }
                  }}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                                  />
            </Grid>
          </Grid>
      </Item>)
      pokeiconPanels = [pokeOverview, pokeLearnset, pokeMoveUsage, pokeItemUsage, pokeCounters, pokeTeammates]
      pokeiconTabs = <Grid container style={{paddingLeft:"5%", display:"grid", gridAutoColumns:"3%", gridAutoFlow:"column", gridGap:"4%"}}>
        {tabList.map(tab => 
        <Grid item style={{width:"200%"}}><TabItem className='tab-style' onClick={this.setTab.bind(this, tab.tabID)}>
          <img src={tab.icon} style={{width:"30%", imageRendering:"pixelated"}}/>
          <br/>
          <Text style={{fontSize: "0.7vw"}}>{tab.name}</Text>
        </TabItem></Grid>)}
        </Grid>
      pokeiconDropdown = pokeiconPanels[currentTab];
    }
    var modalHS = helpStyle
    return (
      <div className="App" style={{display:"grid", overflowX: "hidden"}}>
        <Item className='modal-content' style={{fontSize: "0.4vw", display: modalHS, position: "fixed", zIndex: 20, justifySelf: "center", height: "90%", width: "90%", alignSelf:"start", margin:"auto", marginTop:"1%"}}>
        <Item style={{width:"5%", justifySelf: "right", fontSize: "vw"}} className='button-style' fontFamily="bwFont" onClick={this.setHelpStyle.bind(this, "none")}>Close</Item>
            <Text style={{color:"#2e2e2e"}}>
                <div style={{fontSize: "2vw", fontFamily: "bwFont", justifySelf:"center", justifyContent:"center",textAlign:"center"}}>Welcome to CheeseMans' PokéSearch Engine!</div><br/><br/>
                {`This website was designed to be used as a tool to sort Pokemon by their various attributes.`}<br/>
                {`You can also take a look at each one by clicking on their icon, and the menu can be closed by pressing the "Close" button or by clicking on the same Pokemon icon.`}<br/>
                {`Using the search bar, the list of Pokemon can be filtered. Each filter should be seperated by a singular comma (","). (i.e: "atk > 70, hp < 60, gen = 5")`}<br/>
                {`Pokemon will be hidden if they do not fit ALL of the filters. `}
                {`The list of available filters includes:`}<br/><br/>
                <div style={{overflow:"hidden"}}><ul style={{paddingLeft:"0%", textAlign:"left", columns:3}}>{desc_keys.map(d => 
                  <li style={{display:"inline-block"}}><div style={{fontWeight: "bolder", fontSize:"1.2vw"}}>{titleCase(d) + ":"}<div style={{fontSize:"0.8vw",color:"#4f4f4f"}}>{operator_desc[d]}</div></div><br/></li>
                )}</ul></div>
            </Text>
        </Item>
        <form style={{display:"grid"}} onSubmit={event => {event.preventDefault(); this.autosearch()}}>
        <input id='pokesearchbar' style={{borderRadius: "1.041666667vw", zIndex:12, position: 'fixed', justifySelf: "center", borderWidth:"1px", width:"75%", margin:"auto", display:"block", transform: "translate(0px, 0.5208333333vw)", paddingLeft: "1.041666667vw", fontFamily: "bwFont"}}
        type="text" placeholder='enter search (i.e type = fire, atk > 120)' onChange={event => {this.setQuery(event.target.value)}}/>
        </form>
        <Item style={{width:"5%", justifySelf: "left"}} className='button-style' onClick={this.setHelpStyle.bind(this, "block")}>Help</Item>
        {loadingText}
        <div className='pokePanel' fontFamily={"bwFont"} style={{zIndex: 10, height:(renderPanel ? "40%": "0%")}}>
          {pokeiconDropdown}
          {pokeiconTabs}
        </div>
        <br></br>
        
        <div style={{display:"flex-grid", rowGap:"0px", gridAutoFlow:"row"}}>
        <h2 style={{textAlign: "center", fontFamily:"bwFont"}}>PokéSearch 
        </h2><p style={{textAlign: "center", fontFamily:"bwFont", fontSize:"10px"}}>Powered by Smogon & PokéAPI</p></div>
        
        
        
        <h5 style={{textAlign: "center"}}>{window.mobileCheck() ? "Limited support for mobile devices" : ""}</h5>
        <body>
        <Grid container spacing={1} style={{margin:"30px auto 0"}}>
          {toRender.map(poke => 
          <Fade in timeout={1500}>
          <Grid item xs={4} sm={2} md={1.5} lg={1} key={poke[3]} className='hover-style'>
            <Item style={ {height:"96px", display:"grid", alignContent:"center", justifyContent:"center"}} className='load-style' onClick={this.activateOverlay.bind(this, poke[3])} onMouseOver={this.setMouseOver.bind(this, poke[3])} onMouseLeave={this.resetMouseOver.bind(this)}>
            <div style={{overflow:"visible"}}><img src={process.env.PUBLIC_URL + this.internalPokeGIF(poke[3], 0)} style={{alignContent: "center", imageRendering: "pixelated", overflow:"visible",
              objectPosition: ((getOffset(poke[3], 0) - getOffset(poke[3], 2)/2) + "px " + (-getOffset(poke[3], 1) + getOffset(poke[3], 3)/2) + "px")}} 
              alt="pokemon data"></img></div>
            </Item>
            {<div style={{translate:"35% -225%",position:"absolute"}}>{linkParse(poke[3])}</div>}
          </Grid>
          </Fade>
          )}
        </Grid>
        <div style={{textAlign:"center", alignSelf:"center"}}>{noResults}</div>
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
    var spec_response = await fetch("data/api/"+ID+"/species.json").then((response) => response.json());
    var spriteURL = "data/sprites/"+ID+"/front_default.png"
    var gifURL = null
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

function randomElement(arr)
{
  var ind = Math.round(Math.random()*(arr.length - 1));
  console.log("using index",ind);
  return arr[ind]
}

function randomQuery()
{
  var num = 2 + Math.round(Math.random()*1);
  var query = "";
  var ops = Object.keys(randomOperatorSheet);
  for(var i = 0; i < num; i++)
  {
    var func = randomElement(ops);
    console.log("found",ops, ops.length, func);
    ops.splice(ops.indexOf(func), 1);
    var comps = randomOperatorSheet[func][0];
    var vals = randomOperatorSheet[func][1];
    console.log(func, comps, vals);
    var comp = randomElement(comps);
    var val = randomElement(vals);
    query += func + " " + comp + " " + val;
    if(i < num - 1)
    {
      query += ", "
    }
  }
  
  
  
  return query;
}

function analysis(searchQuery)
{
    if(searchQuery == 'all')
    {
      return data;  
    }
    if(searchQuery.trimEnd().trimStart().toLowerCase() == "random")
    {
      var query = randomQuery();
      searchQuery = query;  
      document.getElementById("pokesearchbar").value = query;
    } 
    var chosenData = []
    if(searchQuery == "")
    {
        chosenData = [];
    }
    else
    {
        var tempList = []
        var args = searchQuery.trimEnd().trimStart().replaceAll(" ","").split(",");

        for(var i = 0; i < args.length; i++)
        {
            tempList = tempList.concat(evaluateArgument(args[i], data, monForms, damageFrom));
        }
        var endList = []
        if(tempList.length == 0)
        {
            endList = [];
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


async function pokeGIF(ID)
{
  console.log(ID, hovering_over)
  if(hovering_over != ID || ID >= 650)
  {
    return ["data/sprites/"+ID+"/front_default.png", 0, 0];
  }
  
  if((ID.toString() in pokegifs) == false && (ID.toString() in addedgifs) == false)
  {
    addedgifs[ID.toString()] = true;
    var p = "data/sprites/"+ID+"/generation-v/front_default.gif"
    var p_png = "data/sprites/"+ID+"/front_default.png"
    var dx = 0
    var dy = 0

    var gif_img = await loadImage(p);
    var png_img = await loadImage(p_png);
    
    dx = png_img.width - gif_img.width
    dy = png_img.height - gif_img.height
    pokegifs[ID.toString()] = [p, dx, dy];
  }

  return pokegifs[ID.toString()]
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


function linkParse(ID)
{
  if(Object.keys(linkDict).includes(ID.toString()))
  {
    return (<div style={{alignContent:"center", alignSelf:"center", display:"flex-grid", textAlign:"center"}}>
      <br style={{display:"block", margin:"0em"}}/>
      <a target="_blank" rel="noopener noreferrer" href={'http://twitter.com/'+linkDict[ID]}>
        <img style={{imageRendering:"pixelated"}} src="sinnohchampribbon.png"></img>
      </a>
      </div>)
  }
  return (<></>)
}

function App()
{
  return(<MainComp/>);
}



export default App;
