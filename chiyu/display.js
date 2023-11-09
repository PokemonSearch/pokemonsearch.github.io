var font_pixeloid;
var w = window.innerWidth;
var h = window.innerHeight;
var max_pkmn = 1017
var chosen_pkmn = Math.round(Math.random()*1017)
var data;
var dmg_calc;
var dmg_perc;
var loaded = false;
var chiyu_img;
var pkmn_img;
var score = 0;
var tera_fire = false;

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

var possible_items = [
    'Assault Vest',
    'Eviolite',
]


var possible_natures = [
    'Calm',
    'Adamant',
    'Modest',
    'Naughty',
    'Lax'
]

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

async function load()
{
    loaded = false;
    var calc_det = Number.MAX_VALUE;
    var lim = 100/(Math.pow(difficulty, 1 + difficulty/50));
    while(!(calc_det < lim && calc_det > -lim*2) || isNaN(calc_det))
    {
        try
        {
            chosen_pkmn = Math.round(Math.random()*1017)
            data = await fetch("../data/api/"+chosen_pkmn+"/api.json").then((response) => response.json());
            var pkmn_name = titleCase(data.species.name);
            console.log(pkmn_name);
            var set = {
                item: randomElement(possible_items),
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
            pkmn_img = loadImage("../data/sprites/"+chosen_pkmn+"/front_default.png");
        
            var chi_yu = new smogon.Pokemon(gen, 'Chi-Yu', chiyu_set)
            var pokemon_1 = new smogon.Pokemon(gen, pkmn_name, set)
            dmg_calc = smogon.calculate(gen, chi_yu, pokemon_1, new smogon.Move(gen, "Overheat"), new smogon.Field({weather:'Sun'}))
            dmg_perc = 100*(dmg_calc.damage[0]/dmg_calc.defender.stats.hp);
            if(dmg_calc.defender.ability == "Sturdy" && dmg_perc >= 100)
            {
                dmg_perc = 100*((dmg_calc.defender.stats.hp - 1)/dmg_calc.defender.stats.hp);
            }
            calc_det = (dmg_perc - 100);
            console.log(calc_det)
        }
        catch
        {
            console.log("failed");
        }

    }

    correct_answer = 0;
    if(dmg_perc >= 100)
    {
        correct_answer = 1;
    }
    console.log(dmg_calc)
    var def_item = dmg_calc.rawDesc.defenderItem
    var item_img = null;
    var item_desc = ""
    if(def_item != null)
    {
        item_desc = " " + def_item
        var internal_name = def_item.toLowerCase().replace(" ", "-");
        item_img = loadImage("../data/items/sprites/"+internal_name+"/"+internal_name+".png");
    }
    desc = [
        "252+ SpA Choice Specs Beads of Ruin Tera Fire Chi-Yu Overheat",
        dmg_calc.rawDesc.HPEVs + " / " + dmg_calc.rawDesc.defenseEVs + item_desc + " (" + dmg_calc.defender.ability + ") " + dmg_calc.rawDesc.defenderName
    ]
    //get rid of the "generating" ui label
    ui.reverse();
    ui.pop();
    //add new ui
    ui.push(new label(score, w/2, -h/12, 92*gra_scale, [0, 0, 0, 1], 0))
    ui.push(new label(desc[0], w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1],0.5))
    ui.push(new dynamic_image(chiyu_img, w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 0.625));
    ui.push(new label("VS", w/2, h/2, 32*gra_scale, [0, 0, 0, 1], 0.75))
    ui.push(new label(desc[1], 3*w/4, h/1.9 + 96*gra_scale, 16*gra_scale, [0, 0, 0, 1], 1))
    ui.push(new dynamic_image(pkmn_img, 3*w/4 - 128*gra_scale, h/2 - 128*gra_scale, 256*gra_scale, 256*gra_scale, 1.125));
    if(def_item != null){ui.push(new dynamic_image(item_img, 3*w/4 + 128*gra_scale - 64*gra_scale, h/2 - 128*gra_scale, 64*gra_scale, 64*gra_scale, 1.5));}
    ui.push(new label("(in sun)", w/2, h/2 + 64*gra_scale, 16*gra_scale, [0, 0, 0, 1], 1.25))
    ui.push(new label("Is it a Guaranteed OHKO?", w/2, h/8, 48*gra_scale, [0, 0, 0, 1], 2))
    ui.push(new button("Yes", w/4  - 512*gra_scale/2, h - h/4, 512*gra_scale, 64*gra_scale, color(125, 215, 125), [255, 255, 255], set_choice_yes, 2.25))
    ui.push(new button("No", 3*w/4 - 512*gra_scale/2, h - h/4, 512*gra_scale, 64*gra_scale, color(255, 125, 125), [255, 255, 255], set_choice_no, 2.5))
    
    loaded = true;
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

async function process_choice()
{
    if(player_decision == correct_answer)
    {
        var extra_time = 0;
        var ans_1 = new label("Correct!", w/2, h/4, 48*gra_scale, [0, 100, 0, 1], 0)
        var ans_2 = new label("Minimum Damage: " + Math.floor(dmg_perc) + "%", w/2, h/4 + 96*gra_scale, 24*gra_scale, [0, 100, 0, 1], 1)
        if(dmg_perc > 160)
        {
            ui.push(new label("very balanced pokemon", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            extra_time = 1;
        }
        if(dmg_perc < 30)
        {
            ui.push(new label("not even a dent?", w/2, h/4 + 148*gra_scale, 14*gra_scale, [0, 0, 0, 1], 3))
            extra_time = 1;
        }
        ui.push(ans_1)
        ui.push(ans_2)
        difficulty++;
        score++;
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
        var ans_1 = new label("Wrong...", w/2, h/4, 48*gra_scale, [100, 0, 0, 1], 0)
        var ans_2 = new label("Minimum Damage: " + Math.floor(dmg_perc) + "%", w/2, h/4 + 96*gra_scale, 24*gra_scale, [100, 0, 0, 1], 1)
        ui.push(ans_1)
        ui.push(ans_2)
        score = 0;
        difficulty = 1;
        await sleep(1)
        alpha_gradient = -1;
        await sleep(1)
        alpha_gradient = 1;
        ui = [
            new label("Generating...", w/2, h/2, 72*gra_scale, [0, 0, 0, 1], 3)
        ]
        load();
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
    clicked = true;
}

function mousePressed() 
{
    dragging = true;
}



