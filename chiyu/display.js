

const currentDate = new Date().toDateString();
var font_pixeloid;
var w = window.innerWidth;
var h = window.innerHeight;
var max_pkmn = 1017
var chosen_pkmn = Math.round(Math.random()*1017)
var data;
var dmg_calc;
var dmg_perc;
var haz_perc = 0;
var haz_text = "";
var loaded = false;
var chiyu_img;
var pkmn_img;
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


var possible_natures = [
    'Calm',
    'Adamant',
    'Modest',
    'Naughty',
    'Lax'
]



const queryString = window.location.search.split("?");
console.log(queryString);
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
    load();
}
var answered = false;

async function load()
{
    loaded = false;
    var calc_det = Number.MAX_VALUE;
    var lim = 200/(0.5 + difficulty/2);
    if(difficulty > 6){lim /= 2;}
    lim = Math.max(lim, 10);
    console.log(smogon);
    var event_function = null
    if(event_dictionary[currentDate] != null)
    {
        event_function = event_dictionary[currentDate][0];
    }
    var event_tries = 50;
    while(!(calc_det < lim) || isNaN(calc_det))
    {
        try
        {
            haz_perc = 0;
            haz_text = "";
            traced = false;
            missed = false;
            chosen_pkmn = Math.round(Math.random()*1025)
            data_str = "../data/api/"+chosen_pkmn
            var spec_data = await fetch("../data/api/"+chosen_pkmn+"/species.json").then((response) => response.json());
            var variants = ["/"]
            var form_names = [""];
            if(spec_data.varieties != null)
            {
                for(var i = 1; i < spec_data.varieties.length; i++)
                {
                    var mon_name = spec_data.varieties[i].pokemon.name;
                    if(mon_name.includes("totem") == false && mon_name.includes("pikachu") == false && mon_name.includes("gmax") == false && mon_name.includes("pikachu") == false && mon_name.includes("eevee") == false && mon_name.includes("busted") == false)
                    {
                        variants.push("/"+mon_name.substring(mon_name.indexOf("-")+1)+"/");
                        form_names.push(mon_name.substring(mon_name.indexOf("-")+1));
                    }

                }
            }
            var chosen_variant = Math.round(Math.random()*(variants.length - 1));
            var form_name = form_names[chosen_variant].replace("-mask","");
            data_str += variants[chosen_variant];
            data = await fetch(data_str+"api.json").then((response) => response.json());
            if(event_function != null && difficulty < 5 && event_tries > 0)
            {
                if(!event_function(spec_data,data))
                {
                    continue;
                }
                event_tries--;
            }
            var pkmn_name = titleCase(data.species.name);
            var item_pool = [...possible_items]
            if(hazard_mode){item_pool.push('Heavy-Duty Boots');}
            var t1 = data.types[0];
            var t2 = data.types[1];
            var weakness = 1;
            if(t2 != null)
            {
                console.log(t1.type.name.toUpperCase())
                console.log(t2.type.name.toUpperCase())
                weakness = getFireWeakness(t1.type.name.toUpperCase())*getFireWeakness(t2.type.name.toUpperCase());
            }
            else
            {
                weakness = getFireWeakness(t1.type.name.toUpperCase());
            }
            if(weakness >= 2)
            {
                item_pool.push('Occa Berry');
            }

            if(data.name.endsWith('-mega') || data.name.endsWith('-mask') || data.name.endsWith('-primal') || data.name.endsWith('-origin') || data.name.endsWith('-ultra') || data.name.endsWith('-crowned') || data.name.startsWith('arceus-') || data.name.startsWith('silvally-'))
            {
                item_pool = [""];
            }

            var set = {
                item: randomElement(item_pool),
                nature: randomElement(possible_natures),
                evs: {hp: 252, spd: 252}
            }
            

            var chiyu_set = {
                item: 'Choice Specs',
                nature: 'Modest',
                evs: {spa: 252},
                teraType: 'Fire'
            }
        
            chiyu_img = loadImage("../data/sprites/1004/front_default.png");
            pkmn_img = loadImage("../data/sprites/"+chosen_pkmn+"/"+form_names[chosen_variant]+"/front_default.png");
        
            var chi_yu = new smogon.Pokemon(gen, 'Chi-Yu', chiyu_set)
            var pokemon_1 = new smogon.Pokemon(gen, titleCase(data.name.replace("-mask","")), set)
            if(pokemon_1.ability == "Trace")
            {
                pokemon_1.ability = chi_yu.ability;
                traced = true;
            }
            var side = {};
            var side_text = "(in sun)"
            var spike_count = 0;
            var rocks = false;
            if(hazard_mode)
            {
                side_text = "(sun"
                spike_count = Math.round(Math.random()*3) 
                rocks = (Math.random() <= 1.0/3)
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
            dmg_calc = smogon.calculate(gen, chi_yu, pokemon_1, new smogon.Move(gen, "Overheat"), new smogon.Field({weather:'Sun', defenderSide:side}));
            var dmg_haz = getHazards(gen, pokemon_1, side);
            dmg_perc = 100*(dmg_calc.damage[0]/dmg_calc.defender.stats.hp);
            haz_perc = 100*(dmg_haz.damage/dmg_calc.defender.stats.hp);
            if(dmg_calc.defender.ability == "Sturdy" && dmg_perc >= 100 && haz_perc <= 0)
            {
                dmg_perc = 100*((dmg_calc.defender.stats.hp - 1)/dmg_calc.defender.stats.hp);
            }
            if(dmg_calc.defender.ability == "Disguise")
            {
                dmg_perc = 0;
            }
            calc_det = Math.abs(dmg_perc + haz_perc - 100);
            if(miss_mode && Math.random() <= 0.1)
            {
                dmg_perc = 0;
                missed = true;
            }
            
        }
        catch(e)
        {
            console.error(e);
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
    var def_item = dmg_calc.rawDesc.defenderItem
    if(dmg_calc.defender.item == "Heavy-Duty Boots")
    {
        def_item = dmg_calc.defender.item;
    }
    var item_img = null;
    var item_desc = ""
    if(def_item != null)
    {
        item_desc = " " + def_item
        var internal_name = def_item.toLowerCase().replace(" ", "-");
        item_img = loadImage("../data/items/sprites/"+internal_name+"/"+internal_name+".png");
    }

    def_ability = dmg_calc.defender.ability;
    if(traced)
    {
        def_ability = "Trace"
    }
    var form_delim = "";
    if(form_name != "")
    {
        form_delim = " ";
    }
    desc = [
        "252+ SpA Choice Specs Beads of Ruin Tera Fire Chi-Yu Overheat",
        dmg_calc.rawDesc.HPEVs + " / " + dmg_calc.rawDesc.defenseEVs + item_desc + " (" + def_ability + ") " + titleCase(form_name.replace("-", " ")) + form_delim + pkmn_name
    ]
    //get rid of the "generating" ui label
    ui.reverse();
    ui.pop();
    //add new ui
    ui.push(new label(score, w/2, -h/32, 92*gra_scale, [0, 0, 0, 1], 0))
    ui.push(new label(desc[0], w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1],0.5))
    ui.push(new dynamic_image(chiyu_img, w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 0.625));
    ui.push(new label("VS", w/2, h/2, 32*gra_scale, [0, 0, 0, 1], 0.75))
    ui.push(new label(desc[1], 3*w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1], 1))
    ui.push(new dynamic_image(pkmn_img, 3*w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 1.125));
    if(def_item != null){ui.push(new dynamic_image(item_img, 3*w/4 + 128*gra_scale - 64*gra_scale, h/2 - 128*gra_scale, 64*gra_scale, 64*gra_scale, 1.5));}
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
            ui.push(new label("very balanced pokemon", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
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




