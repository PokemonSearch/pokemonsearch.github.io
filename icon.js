window.global = window;
const options = {
        headers: new Headers({'Access-Control-Allow-Origin': '*'}),
    }

const windowFetch = window.fetch.bind(window);
const dex = window.global.window.dex.Dex
const smogon = new window.global.window.smogon.Smogon(windowFetch);
const gens = new window.global.window.generations.Generations(dex);
const get_smogon_data = false;
var name_dict = {};




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


class PokeIcon
{
    constructor(id)
    {
        running++;
        this.ID = id
        this.current_form = 0
        this.img = [loadImage("data/sprites/"+id+"/front_default.png")]
        this.forms = []
        this.abilities = []
        this.hasData = false;
        this.data = null;
        this.spec_data = null
        this.smogon_data = null
        this.alpha = 0;
        this.loaded = false;
        this.name = "";
        this.raw_scale = 2;
        this.loaded_misc = false;
        this.loadData();
        if(!this.loaded)
        {
            this.loadInAnim(1);
        }
    }

    async loadMiscData()
    {
        if(this.loaded_misc){return;}
        this.loaded_misc = true;
        console.log("loading misc for " + this.name);
        for(var i = getGen(this.ID); i <= 9; i++)
        {
            try
            {
                if(get_smogon_data)
                {
                    var misc_data = await smogon.stats(gens.get(i), this.name)
                    if(misc_data != undefined)
                    {
                        this.smogon_data.misc_stats[i.toString()] = misc_data
                    }
                }
                else
                {
                    this.smogon_data.misc_stats[i.toString()] = null
                }
            }
            catch
            {

            }
        }
    }

    async loadData()
    {
        var response = await fetch("data/api/"+this.ID+"/api.json").then((response) => response.json())
        var spec_response = await fetch("data/api/"+this.ID+"/species.json").then((response) => response.json())
        this.data = response;
        this.spec_data = spec_response
        this.name = splitTitleCase(this.data.species.name);
        name_dict[this.data.species.name] = this.ID+"";
        console.log(this.name);
        this.smogon_data = {
            sets: {},
            misc_stats: {}
        };
        for(var i = getGen(this.ID); i <= 9; i++)
        {
            var genid = "gen"+(i).toString()
            this.smogon_data.sets[i.toString()] = []
            if(get_smogon_data)
            {
                for(var t = 0; t < smogon_tiers[genid].length; t++)
                {
                    var tiername = genid + smogon_tiers[genid][t]
                    var full_data = await smogon.sets(gens.get(i), this.name, tiername)
                    for(var d = 0; d < full_data.length; d++)
                    {
                        var set_obj = {
                            tierid: tiername,
                            tier: "Gen " + i.toString() + " " + smogon_tiers[genid][t].toUpperCase(),
                            data: full_data[d]
                        }
                        if(set_obj.data.length != 0)
                        {
                            this.smogon_data.sets[i.toString()].push(set_obj)
                        }
                    }
                }
            }
        }
        console.log(this.smogon_data)

        
        
        var v = Object.keys(this.spec_data.varieties)
        
        for(var i = 1; i < v.length; i++)
        {
            if(Object.keys(form_whitelist).includes(str(this.ID)) && !form_whitelist[this.ID].includes(i)){continue;}
            /**@type String */
            var fullName = this.spec_data.varieties[v[i]]["pokemon"]["name"]
            var formName = fullName.replace(this.data["species"]["name"] + "-","")
            var path = "data/sprites/"+this.ID+"/"+formName+"/front_default.png"
            var a_img = loadImage(path);
            if(a_img != null)
            {
                var form_data_response = await fetch("data/api/"+this.ID+"/"+formName+"/api.json").then((response) => response.json())
                this.img.push(a_img)
                var formObj = {
                    name: titleCase(formName),
                    img: a_img,
                    data: form_data_response
                }
                name_dict[fullName] = this.ID+"/"+formName;
                this.forms.push(formObj)
            }
            else
            {
                this.img.push(this.img[0])
            }
        }
        
        this.abilities = this.abilities.concat(this.data.abilities);

        this.hasData = true;
        finishedLoading++;
        running--;
    }

    render(x, y, size)
    {
        var scale = 1;
        var overX = (mouseX >= x && mouseX <= x + size)
        var overY = (mouseY >= y && mouseY <= y + size)
        var over = overX && overY;
        if(over && mouseY >= viewrange[0] && mouseY <= viewrange[1] && !overlay && w > 960 && h > 540)
        {
            scale = 1.3;
            if(clicked)
            {
                if(noDropdown)
                {
                    this.current_form++;
                    if(this.current_form > this.forms.length)
                    {
                        this.current_form = 0;
                    }
                }
                else
                {
                    if(pokemonDisplay.active && pokemonDisplay.activePokemon == this && pokemonDisplay.displayed_form == 0)
                    {
                        pokemonDisplay.close();
                    }
                    else
                    {
                        pokemonDisplay.setActivePokemon(this, true);
                    }
                }
            }
            if(this.hasData)
            {   
                console.log(size);
                var pkname = this.name
                if(this.current_form != 0)
                {
                    pkname = this.forms[this.current_form - 1].name + " " + this.name
                }
                buffer_text(pkname, 20*0.7*size/86.20370370370371, x + size/2, y + size/2 + 20, color(255, 255, 255, 255*((this.raw_scale - 1)/(scale - 1))), true);
            }
        }
        this.raw_scale += 0.01*deltaTime*(scale - this.raw_scale);
        tint(255, 255, 255, this.alpha);
        noSmooth();
        image(this.img[this.current_form], x + 0.5*size*(1 - this.raw_scale), y + 0.5*size*(1 - this.raw_scale), size*this.raw_scale, size*this.raw_scale);


    }

    async loadInAnim(length)
    {
        this.loaded = true;
        this.alpha = 0;
        await delay(1);
        for(var t = 0; t <= length*100; t++)
        {
            await delay(1.0/100.0);
            this.alpha = tween(t/(length*100.0), 0, 255.0);
        }
        this.alpha = 255;
    }
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

function titleCase(/**@type String */str)
{
    /**@type String */
    var base = str.toLowerCase()
    return base.charAt(0).toUpperCase() + base.slice(1);
}

