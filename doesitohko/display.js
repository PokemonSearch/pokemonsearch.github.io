

var font_pixeloid;
var w = window.innerWidth;
var h = window.innerHeight;
var max_pkmn = 1017
var defender_pkmn = Math.round(Math.random()*1017)
var attacker_pkmn = 0;
var data;
var dmg_calc;
var dmg_perc;
var haz_perc = 0;
var haz_text = "";
var loaded = false;
var atk_img;
var def_img;
var score = 0;
var tera_fire = false;
var pressing = true;
var miss_mode = false;
var pause_mode = false;
var hazard_mode = false;
var missed = true;
var ui = [
    new label("Generating...", w/2, h/2, 72*gra_scale, [0, 0, 0, 1], 0)
]
var clicked = true;
window.global = window;
const smogon = window.global.window.calc;
const gen = smogon.Generations.get(9);
var desc = []
var gra_scale = w/1920
var player_decision = -1;
var correct_answer = -1;
var difficulty = 1;
var traced = false;
var possible_items = [
    'Assault Vest',
    'Eviolite'
]
var edit_mode = false;

var possible_natures = [
    'Calm',
    'Adamant',
    'Modest',
    'Naughty',
    'Lax'
]

var answered = false;
var attacker_data;
var attacker_name;
var attacker_set;
var attacker_move;
var pokemon_attacker;
var weather_text;

var name_json;
var editor_result = {
    id: null,
    item: null,
    ability: null,
    nature: null,
    evs: null,
    ivs: null,
    tera: null,
    weather: null,
    move: null,
    result_ui: null
}

var attacker_query = null;
var valid = true;

const queryString = window.location.search.split("?");

if(queryString.length <= 1)
{
    edit_mode = true;
}
else
{
    queryString.reverse();
    queryString.pop();
    queryString.reverse();
    try
    {
        attacker_query = {
            id: Math.round(Number(queryString[0].replace("%20"," "))),
            item: queryString[1].replace("%20"," "),
            ability: queryString[2].replace("%20"," "),
            nature: queryString[3].replace("%20"," "),
            evs: queryString[4].split(","),
            ivs: queryString[5].split(","),
            tera: queryString[6].replace("%20"," "),
            weather: queryString[7].replace("%20"," "),
            move: queryString[8].replace("%20"," "),
            
        }
    }
    catch
    {
        valid = false;
    }
}
console.log(queryString);
//sample query: ?445?Choice Band?Rough Skin?Adamant?0,252,0,0,0,252?31,31,31,31,31,31?Ground?Rain?Earthquake
//sample 2: ?382?Choice%20Specs?Drizzle?Modest?0,252,0,0,0,252?31,31,31,31,31,31?Ground?Rain?Water%20Spout

if(queryString.includes("realistic=true"))
{
    miss_mode = true;
}
if(queryString.includes("pause"))
{
    pause_mode = true;
}
if(queryString.includes("hazards") || queryString.includes("hazards"))
{
    hazard_mode = true;
}

function setup()
{
    console.log(w)
    console.log(gra_scale)
    font_pixeloid = loadFont("../fonts/bw2 (t&i)(edited).ttf");
    textFont(font_pixeloid)
    canvas = createCanvas(w, h);
    canvas.position(0,0);
    canvas.style("display","block");
    textAlign(LEFT, TOP);
    if(edit_mode)
    {
        load_editor();
    }
    else
    {
        validity_preload();
    }
}

async function load_editor()
{
    console.log("loading editor")
    name_json = await fetch("../data/api/name_atlas.json").then((response) => response.json());

    var dist_factor = 3;
    //ID
    var y_level = 0
    ui.push(new textbox(w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Pokemon: ", "", function(x) {
        var raw_text = x.text.replace(" ", "-").toLowerCase();
        if(name_json.hasOwnProperty(raw_text)){editor_result.id = name_json[raw_text];}
        try_compile();
    }));

    //MOVE
    y_level = 0
    ui.push(new textbox(3*w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Move Used: ", "", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.move = raw_text;
        try_compile();
    }));

    //ITEM
    y_level = 1
    ui.push(new textbox(w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Held Item: ", "None", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.item = raw_text;
        try_compile();
    }));

    //ABILITY
    y_level = 1
    ui.push(new textbox(3*w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Ability: ", "", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.ability = raw_text;
        try_compile();
    }));

    //NATURE
    y_level = 2
    ui.push(new textbox(w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Nature: ", "Serious", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.nature = raw_text;
        try_compile();
    }));

    //TERA
    y_level = 2
    ui.push(new textbox(3*w/4 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Tera Type: ", "None", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.tera = raw_text;
        try_compile();
    }));

    //EVS
    y_level = 3
    editor_result.evs = {HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0};
    var ev_names = ['HP','Atk','Def','SpA','SpD','Spe']
    for(var i = 0; i < 6; i++)
    {
        var x_i = i;
        if(i >= 3)
        {
            x_i -= 3;
        }
        y_i = 0;
        if(i >= 3)
        {
            y_i = 1;
        }
        ui.push(new textbox(w/10 + (w + w/12 - w/10)*((x_i+1)/4) - 0.5*gra_scale*w/4, 40*gra_scale + dist_factor*gra_scale*32*(y_level + y_i), w/12, gra_scale*32, ev_names[i] + " EVs: ", "0", function(x) {
            var raw_text = fullTitleCase(x.text.toLowerCase());
            editor_result.evs[x.title_label.text.substring(0, 3).trim()] = raw_text;
            console.log(editor_result);
            try_compile();
        }));
        
    }
    
    //IVS
    y_level = 5
    editor_result.ivs = {HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0};
    var iv_names = ['HP','Atk','Def','SpA','SpD','Spe']
    for(var i = 0; i < 6; i++)
    {
        var x_i = i;
        if(i >= 3)
        {
            x_i -= 3;
        }
        y_i = 0;
        if(i >= 3)
        {
            y_i = 1;
        }
        ui.push(new textbox(w/10 + (w + w/12 - w/10)*((x_i+1)/4) - 0.5*gra_scale*w/4, 40*gra_scale + dist_factor*gra_scale*32*(y_level + y_i), w/12, gra_scale*32, iv_names[i] + " IVs: ", "31", function(x) {
            var raw_text = fullTitleCase(x.text.toLowerCase());
            editor_result.ivs[x.title_label.text.substring(0, 3).trim()] = raw_text;
            console.log(editor_result);
            try_compile();
        }));
        
    }

    //WEATHER
    y_level = 7
    ui.push(new textbox(w/2 - 0.5*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, w/4, gra_scale*32, "Weather: ", "Clear", function(x) {
        var raw_text = fullTitleCase(x.text.toLowerCase());
        editor_result.weather = raw_text;
        try_compile();
    }));

    //WEATHER
    y_level = 8
    editor_result.result_ui = new textbox(w/2 - 0.5*3*w/4, 40*gra_scale + dist_factor*gra_scale*32*y_level, 3*w/4, gra_scale*32, "", "", function(x) {});
    ui.push(editor_result.result_ui);

    
    
}

async function try_compile()
{
    try
    {
        var comp_id = editor_result.id;
        if(comp_id == null || comp_id == ''){return;}
        var comp_move = editor_result.move;
        if(comp_move == null || comp_move == ''){return;}
        var comp_item = editor_result.item;
        if(comp_item == null || comp_item == ''){comp_item = 'None';}
        var comp_ability = editor_result.ability;
        if(comp_ability == null || comp_ability == ''){return;}
        var comp_nature = editor_result.nature;
        if(comp_nature == null || comp_nature == '' || comp_nature == 'None'){return;}
        var comp_evs = editor_result.evs.HP + ","+editor_result.evs.Atk+","+editor_result.evs.Def+","+editor_result.evs.SpA+","+editor_result.evs.SpD+","+editor_result.evs.Spe;
        var comp_ivs = editor_result.ivs.HP + ","+editor_result.ivs.Atk+","+editor_result.ivs.Def+","+editor_result.ivs.SpA+","+editor_result.ivs.SpD+","+editor_result.ivs.Spe;
        var comp_tera = editor_result.tera;
        if(comp_tera == null || comp_tera == ''){comp_tera = 'None';}
        var comp_weather = editor_result.weather;
        var comp_url = "jsdexdb.github.io/doesitohko/?"+comp_id+"?"+comp_item+"?"+comp_ability+"?"+comp_nature+"?"+comp_evs+"?"+comp_ivs+"?"+comp_tera+"?"+comp_weather+"?"+comp_move;
        comp_url = comp_url.replace(" ","%20");
        editor_result.result_ui.box.value(comp_url);
    }
    catch
    {
        console.log("invalid settings");
    }

}


async function validity_preload()
{
    console.log('preloading');
    try
    {
        attacker_pkmn = attacker_query.id;
        attacker_data = await fetch("../data/api/"+attacker_pkmn+"/api.json").then((response) => response.json());
        attacker_name = titleCase(attacker_data.species.name);
        console.log("searching: " + "../data/api/"+attacker_pkmn+"/api.json")
        console.log(attacker_data)
        attacker_set = {
            item: attacker_query.item,
            nature: attacker_query.nature,
            evs: {
                hp:Number(attacker_query.evs[0]),
                atk:Number(attacker_query.evs[1]),
                def:Number(attacker_query.evs[2]),
                spa:Number(attacker_query.evs[3]),
                spd:Number(attacker_query.evs[4]),
                spe:Number(attacker_query.evs[5])
            },
            ivs: {
                hp:Number(attacker_query.ivs[0]),
                atk:Number(attacker_query.ivs[1]),
                def:Number(attacker_query.ivs[2]),
                spa:Number(attacker_query.ivs[3]),
                spd:Number(attacker_query.ivs[4]),
                spe:Number(attacker_query.ivs[5])
            },
            ability: attacker_query.ability,
            tera: null
        }
        if(attacker_query.tera != "None")
        {
            attacker_set.tera = attacker_query.tera;
        }
        attacker_move = new smogon.Move(gen, attacker_query.move);
        if(attacker_move == null || attacker_move.type == undefined)
        {
            valid = false;
        }
        console.log(attacker_move);
        atk_img = loadImage("../data/sprites/"+attacker_pkmn+"/front_default.png");
        pokemon_attacker = new smogon.Pokemon(gen, attacker_name, attacker_set);
        weather_text = "";

        if(attacker_query.weather != "Clear")
        {
            weather_text = attacker_query.weather;
        }
        console.log(pokemon_attacker);
    }
    catch
    {
        valid = false;
    }

    if(valid && (await test_calc()))
    {
        load();
    }
    else
    {
        console.log('invalid');
        ui.push(new label("Invalid Settings", w/2, 1.25*h/4, 72*gra_scale, [0, 0, 0, 1], 0));
        ui.push(new label("Make sure you inputted the correct spelling...", w/2, 1.25*h/4 + 2.5*72*gra_scale, 24*gra_scale, [0, 0, 0, 1], 1));
    }
}

async function test_calc()
{
    try
    {
        haz_perc = 0;
        haz_text = "";
        traced = false;
        missed = false;
        defender_pkmn = Math.round(Math.random()*1017)
        
        var defender_data = await fetch("../data/api/"+defender_pkmn+"/api.json").then((response) => response.json());
        
        console.log(attacker_data)
        var defender_name = titleCase(defender_data.species.name);
        
        var item_pool = [...possible_items]
        if(hazard_mode){item_pool.push('Heavy-Duty Boots');}

        var ev_def = 0;
        var ev_spd = 0;
        var ev_hp = 252*Math.round(Math.random());
        if(attacker_move.category == 'Physical'){ev_def = 252*Math.round(Math.random());}
        if(attacker_move.category == 'Special'){ev_spd = 252*Math.round(Math.random());}
        var defender_set = {
            item: randomElement(item_pool),
            nature: randomElement(possible_natures),
            evs: {hp: ev_hp, def: ev_def, spd: ev_spd}
        }
        
        def_img = loadImage("../data/sprites/"+defender_pkmn+"/front_default.png");
    
        
        var pokemon_defender = new smogon.Pokemon(gen, defender_name, defender_set)
        console.log(pokemon_defender)
        if(pokemon_defender.ability == "Trace")
        {
            pokemon_defender.ability = pokemon_attacker.ability;
            traced = true;
        }
        var side = {};
        var side_text = ""
        if(attacker_query.weather != "Clear")
        {
            "(in " + weather_text+")";
        }
        var spike_count = 0;
        var rocks = false;
        if(hazard_mode)
        {
            side_text = "("+weather_text
            spike_count = Math.round(Math.random()*3) 
            rocks = (Math.random() >= 1.0/3)
            if(spike_count == 1)
            {
                side_text += " + " + spike_count + " spike"
            }
            if(spike_count > 1)
            {
                side_text += " + " + spike_count + " spikes"
            }
            if(rocks)
            {
                side_text += " + stealth rocks"
            }
            side_text += ")"
            side = {
                spikes: spike_count,
                stealthrocks: spike_count,
                isSR: rocks
            }
        }
        dmg_calc = smogon.calculate(gen, pokemon_attacker, pokemon_defender, attacker_move, new smogon.Field({weather:attacker_query.weather, defenderSide:side}));
        var dmg_haz = getHazards(gen, pokemon_defender, side);
        console.log(dmg_calc)
        dmg_perc = 100*(dmg_calc.damage[0]/dmg_calc.defender.stats.hp);
        haz_perc = 100*(dmg_haz.damage/dmg_calc.defender.stats.hp);
        if(pokemon_attacker.ability != "Mold Breaker")
        {
            if(dmg_calc.defender.ability == "Sturdy" && dmg_perc >= 100 && haz_perc <= 0)
            {
                dmg_perc = 100*((dmg_calc.defender.stats.hp - 1)/dmg_calc.defender.stats.hp);
            }
            if(dmg_calc.defender.ability == "Disguise")
            {
                dmg_perc = 0;
            }
        }
        
        if(miss_mode && Math.random() >= attacker_move.accuracy)
        {
            dmg_perc = 0;
            missed = true;
        }
        return true;
    }
    catch
    {
        return false;
    }
}



async function load()
{
    loaded = false;
    console.log("loading: ");
    


    var calc_det = Number.MAX_VALUE;
    var lim = 200/(0.5 + difficulty/2);
    if(difficulty > 6){lim /= 2;}
    lim = Math.max(lim, 10);
    console.log(smogon)
    
    while(!(calc_det < lim) || isNaN(calc_det))
    {
        try
        {
            haz_perc = 0;
            haz_text = "";
            traced = false;
            missed = false;
            defender_pkmn = Math.round(Math.random()*1017)
            
            var defender_data = await fetch("../data/api/"+defender_pkmn+"/api.json").then((response) => response.json());
            
            console.log(attacker_data)
            var defender_name = titleCase(defender_data.species.name);
            
            var item_pool = [...possible_items]
            if(hazard_mode){item_pool.push('Heavy-Duty Boots');}

            var ev_def = 0;
            var ev_spd = 0;
            var ev_hp = 252*Math.round(Math.random());
            if(attacker_move.category == 'Physical'){ev_def = 252*Math.round(Math.random());}
            if(attacker_move.category == 'Special'){ev_spd = 252*Math.round(Math.random());}
            var defender_set = {
                item: randomElement(item_pool),
                nature: randomElement(possible_natures),
                evs: {hp: ev_hp, def: ev_def, spd: ev_spd}
            }
            
            

        
            
            def_img = loadImage("../data/sprites/"+defender_pkmn+"/front_default.png");
        
            
            var pokemon_defender = new smogon.Pokemon(gen, defender_name, defender_set)
            console.log(pokemon_defender)
            if(pokemon_defender.ability == "Trace")
            {
                pokemon_defender.ability = pokemon_attacker.ability;
                traced = true;
            }
            var side = {};
            var side_text = ""
            if(attacker_query.weather != "Clear")
            {
                "(in " + weather_text+")";
            }
            var spike_count = 0;
            var rocks = false;
            if(hazard_mode)
            {
                side_text = "("+weather_text
                spike_count = Math.round(Math.random()*3) 
                rocks = (Math.random() >= 1.0/3)
                if(spike_count == 1)
                {
                    side_text += " + " + spike_count + " spike"
                }
                if(spike_count > 1)
                {
                    side_text += " + " + spike_count + " spikes"
                }
                if(rocks)
                {
                    side_text += " + stealth rocks"
                }
                side_text += ")"
                side = {
                    spikes: spike_count,
                    stealthrocks: spike_count,
                    isSR: rocks
                }
            }
            dmg_calc = smogon.calculate(gen, pokemon_attacker, pokemon_defender, attacker_move, new smogon.Field({weather:attacker_query.weather, defenderSide:side}));
            var dmg_haz = getHazards(gen, pokemon_defender, side);
            console.log(dmg_calc)
            dmg_perc = 100*(dmg_calc.damage[0]/dmg_calc.defender.stats.hp);
            haz_perc = 100*(dmg_haz.damage/dmg_calc.defender.stats.hp);
            calc_det = Math.abs(dmg_perc + haz_perc - 100);
            if(pokemon_attacker.ability != "Mold Breaker")
            {
                if(dmg_calc.defender.ability == "Sturdy" && dmg_perc >= 100 && haz_perc <= 0)
                {
                    dmg_perc = 100*((dmg_calc.defender.stats.hp - 1)/dmg_calc.defender.stats.hp);
                }
                if(dmg_calc.defender.ability == "Disguise")
                {
                    dmg_perc = 0;
                }
            }
            
            if(miss_mode && Math.random() >= attacker_move.accuracy)
            {
                dmg_perc = 0;
                missed = true;
            }
            
        }
        catch (e)
        {
            console.log("failed");
            console.log(e);
        }

    }

    correct_answer = 0;
    if(dmg_perc + haz_perc >= 100)
    {
        correct_answer = 1;
    }
    haz_text = ""
    console.log(haz_perc)
    if(haz_perc > 0)
    {
        haz_text = " (+ " + Math.round(haz_perc) + "% Hazard Damage)"
    }
    console.log(haz_text)
    var atk_item = dmg_calc.rawDesc.attackerItem;
    var def_item = dmg_calc.rawDesc.defenderItem;
    if(dmg_calc.defender.item == "Heavy-Duty Boots")
    {
        def_item = dmg_calc.defender.item;
    }

    var atk_item_img = null;
    var atk_item_desc = ""
    if(atk_item != null)
    {
        atk_item_desc = " " + atk_item
        var internal_name = atk_item.toLowerCase().replace(" ", "-");
        atk_item_img = loadImage("../data/items/sprites/"+internal_name+"/"+internal_name+".png");
    }


    var def_item_img = null;
    var def_item_desc = ""
    if(def_item != null)
    {
        def_item_desc = " " + def_item
        var internal_name = def_item.toLowerCase().replace(" ", "-");
        def_item_img = loadImage("../data/items/sprites/"+internal_name+"/"+internal_name+".png");
    }

    def_ability = pokemon_defender.ability;
    if(traced)
    {
        def_ability = "Trace"
    }

    var a_spe = dmg_calc.attacker.stats.spe
    var d_spe = dmg_calc.defender.stats.spe

    desc = [
        dmg_calc.rawDesc.attackEVs + atk_item_desc + " (" + pokemon_attacker.ability + ") " + dmg_calc.rawDesc.attackerName + " (" + a_spe + " Spe) " + dmg_calc.move.name,
        dmg_calc.rawDesc.HPEVs + " / " + dmg_calc.rawDesc.defenseEVs + def_item_desc + " (" + def_ability + ") " + dmg_calc.rawDesc.defenderName + " (" + d_spe + " Spe)"
    ]
    //get rid of the "generating" ui label
    ui.reverse();
    ui.pop();
    //add new ui
    ui.push(new label(score, w/2, -h/32, 92*gra_scale, [0, 0, 0, 1], 0))
    ui.push(new label(desc[0], w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1],0.5))
    ui.push(new dynamic_image(atk_img, w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 0.625));
    if(atk_item != null){ui.push(new dynamic_image(atk_item_img, w/4 - 128*gra_scale - 64*gra_scale, h/2 - 128*gra_scale, 64*gra_scale, 64*gra_scale, 1.5));}
    ui.push(new label("VS", w/2, h/2, 32*gra_scale, [0, 0, 0, 1], 0.75))
    ui.push(new label(desc[1], 3*w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1], 1))
    ui.push(new dynamic_image(def_img, 3*w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 1.125));
    if(def_item != null){ui.push(new dynamic_image(def_item_img, 3*w/4 + 128*gra_scale - 64*gra_scale, h/2 - 128*gra_scale, 64*gra_scale, 64*gra_scale, 1.5));}
    if(dmg_calc.rawDesc.defenseEVs == "252+ SpD"){ui.push(new label("SpD Boosting Nature", 3*w/4 + 128*gra_scale + 64*gra_scale, h/2 + 64*gra_scale, 20*gra_scale, [200, 100, 100, 1], 1.625));}
    if(dmg_calc.rawDesc.defenseEVs == "252- SpD"){ui.push(new label("SpD Lowering Nature", 3*w/4 + 128*gra_scale + 64*gra_scale, h/2 + 64*gra_scale, 20*gra_scale, [100, 100, 200, 1], 1.625));}
    ui.push(new label(side_text, w/2, h/2 + 64*gra_scale, 16*gra_scale, [0, 0, 0, 1], 1.25))
    ui.push(new label("Is it a Guaranteed OHKO?", w/2, h/6, 48*gra_scale, [0, 0, 0, 1], 2))
    ui.push(new button("Yes", w/4  - 512*gra_scale/2, h - h/4, 512*gra_scale, 64*gra_scale, color(125, 215, 125), [255, 255, 255], set_choice_yes, 2.25, true))
    ui.push(new button("No", 3*w/4 - 512*gra_scale/2, h - h/4, 512*gra_scale, 64*gra_scale, color(255, 125, 125), [255, 255, 255], set_choice_no, 2.5, true))
    if(miss_mode){ui.push(new label("you asked for this jeudy", w/16, 0, 16*gra_scale, [0, 0, 0, 1], 1.25));}
    loaded = true;
    answered = false;
}

function set_choice_yes()
{
    player_decision = 1;
    process_choice();
}

function set_choice_no()
{
    player_decision = 0;
    process_choice();
}

async function continue_game()
{
    alpha_gradient = -1;
    await sleep(1)
    alpha_gradient = 1;
    ui = [
        new label("Generating...", w/2, h/2, 72*gra_scale, [0, 0, 0, 1], 3)
    ]
    load();
}

async function process_choice()
{
    answered = true;
    if(player_decision == correct_answer)
    {
        var extra_time = 0;
        var ans_1 = new label("Correct!", w/2, h/4, 48*gra_scale, [0, 100, 0, 1], 0)
        var ans_2 = new label("Minimum Damage: " + Math.floor(dmg_perc) + "%"+ haz_text, w/2, h/4 + 96*gra_scale, 24*gra_scale, [0, 100, 0, 1], 1)
        if(dmg_perc > 160)
        {
            ui.push(new label("looks like a bad matchup", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            extra_time = 1;
        }
        if(dmg_perc < 30)
        {
            if(missed)
            {
                ui.push(new label("it missed lol", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            }
            else
            {
                ui.push(new label("not even a dent?", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            }
            extra_time = 1;
        }
        ui.push(ans_1)
        ui.push(ans_2)
        difficulty++;
        score++;
        if(!pause_mode)
        {
            await sleep(1 + extra_time)
            alpha_gradient = -1;
            await sleep(1)
            alpha_gradient = 1;
            ui = [
                new label("Generating...", w/2, h/2, 72*gra_scale, [0, 0, 0, 1], 3)
            ]
            load();
        }
        else
        {
            ui.push(new button("Next", w/2  - 512*gra_scale/2, h/2 - 32*gra_scale, 512*gra_scale, 32*gra_scale, color(125, 125, 125), [255, 255, 255], continue_game, 3));
        }
    }
    else
    {
        var extra_time = 0;
        var ans_1 = new label("Wrong...", w/2, h/4, 48*gra_scale, [100, 0, 0, 1], 0)
        var ans_2 = new label("Minimum Damage: " + Math.floor(dmg_perc) + "%" + haz_text, w/2, h/4 + 96*gra_scale, 24*gra_scale, [100, 0, 0, 1], 1)
        if(missed)
        {
            ui.push(new label("it missed lol", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            extra_time = 1;
        }
        ui.push(ans_1)
        ui.push(ans_2)
        score = 0;
        difficulty = 1;
        if(!pause_mode)
        {
            await sleep(1 + extra_time)
            alpha_gradient = -1;
            await sleep(1)
            alpha_gradient = 1;
            ui = [
                new label("Generating...", w/2, h/2, 72*gra_scale, [0, 0, 0, 1], 3)
            ]
            load();
        }
        else
        {
            ui.push(new button("Next", w/2  - 512*gra_scale/2, h/2 - 32*gra_scale, 512*gra_scale, 32*gra_scale, color(125, 125, 125), [255, 255, 255], continue_game, 3));
        }
    }
}

function draw()
{
    background(255);
    for(var i = 0; i < ui.length; i++)
    {
        ui[i].render()
    }

    if(clicked){clicked = false;}
    //console.log(editor_result)
}

function mouseClicked() 
{
    //clicked = true;
}

function touchStarted() 
{
    clicked = true;
}

function mousePressed()
{
    clicked = true;
}




