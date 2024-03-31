import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useSpring, animated} from 'react-spring';

const MAX_PKMN = 1025;
var loaded_pkmn = 0;
var inline_loaded = 0;
var startedLoading = false;
const delay = ms => new Promise(res => setTimeout(res, ms));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));




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



function pokeIcon(ID)
{
  var pokedata = data[ID]
  console.log(pokedata)
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
async function load_data(updateLoader, lD)
{
  if(startedLoading)
  {
    return;
  }
  startedLoading = true;
  for(var i = 1; i <= MAX_PKMN; i++)
  {
    if(i > loaded_pkmn)
    {
      loaded_pkmn++;
      var mon_data = await getData(i);
      data.push(mon_data);
      updateLoader(data);
      await delay(2);
    }
  }
}

function App() {
/*   console.log(data);
  var grid_rows = []
  for(var i = 1; i <= MAX_PKMN; i++)
  {
    grid_rows.push(pokeIcon(i));
  } */
  const [loadedData, setLoad] = useState([]);
  
  load_data(setLoad, loadedData);
  console.log(inline_loaded);
  if(inline_loaded != data.length)
  {
    setLoad(data);
    inline_loaded = data.length; 
    console.log("inline:",inline_loaded, loadedData);
  }
  React.useEffect(() => {
    console.log("loadedData: ", loadedData);
  })
  const props = useSpring({
    to: {opacity: 1},
    from: {opacity: 0},
    reset: true
  })
  return (
    <div className="App">
      
      <h1 style={{textAlign: "center"}}>JSDex</h1>
      <body>
      <Grid container spacing={1}>
        {data.map(poke => 
        
        <Grid item xs={1} sm={4} md={1.5} key={poke[3]}>
          <Item style={{}} className='load-style'>
          <img src={process.env.PUBLIC_URL + poke[2]} style={{alignContent: "center"}} alt="pokemon data"></img>
          <h3 style={{textAlign: "center"}}>{titleCase(poke[0].name)}</h3>
          </Item>
        </Grid>
        )}
      </Grid>
      </body>
    </div>
  );
}



export default App;
