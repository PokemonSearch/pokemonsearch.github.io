var form_whitelist = 
    {
        "25": [1, 2, 4, 5, 14, 16],
        "658": [2],
        "718": [1,2,3],
        "1007": [],
        "1008": []
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
        this.alpha = 0;
        this.loaded = false;
        this.name = "";
        this.raw_scale = 2;
        this.loadData();
        if(!this.loaded)
        {
            this.loadInAnim(1);
        }
    }

    async loadData()
    {
        var response = await fetch("data/api/"+this.ID+"/api.json").then((response) => response.json())
        var spec_response = await fetch("data/api/"+this.ID+"/species.json").then((response) => response.json())
        this.data = response;
        this.spec_data = spec_response

        this.name = splitTitleCase(this.data.species.name);
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
                var fromObj = {
                    name: titleCase(formName),
                    img: a_img,
                    data: form_data_response
                }
                this.forms.push(fromObj)
            }
            else
            {
                this.img.push(this.img[0])
            }
        }
        
        this.abilities = this.abilities.concat(this.data.abilities);

        this.hasData = true;
        running--;
    }

    render(x, y, size)
    {
        var scale = 1;
        var overX = (mouseX >= x && mouseX <= x + size)
        var overY = (mouseY >= y && mouseY <= y + size)
        var over = overX && overY;
        if(over && mouseY >= viewrange[0] && mouseY <= viewrange[1])
        {
            scale = 1.3;
            if(clicked)
            {
                if(pokemonDisplay.active && pokemonDisplay.activePokemon == this && pokemonDisplay.displayed_form == 0)
                {
                    pokemonDisplay.active = false;
                }
                else
                {
                    pokemonDisplay.setActivePokemon(this, true);
                }
            }
            if(this.hasData)
            {   
                buffer_text(this.name, 20, x + size/2, y + size/2 + 20, color(255, 255, 255, 255*((this.raw_scale - 1)/(scale - 1))), true);
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