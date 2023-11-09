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
var ui = [

]
window.global = window;
const smogon = window.global.window.calc;
const gen = smogon.Generations.get(9);
var desc = []
function setup()
{
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
    data = await fetch("../data/api/"+chosen_pkmn+"/api.json").then((response) => response.json());
    var pkmn_name = titleCase(data.species.name);
    var set = {
        item: 'Assault Vest',
        nature: 'Calm',
        evs: {hp: 252, spd: 252}
    }
    var chiyu_set = {
        item: 'Choice Specs',
        nature: 'Modest',
        evs: {spa: 252}
    }

    chiyu_img = loadImage("../data/sprites/1004/front_default.png");
    pkmn_img = loadImage("../data/sprites/"+chosen_pkmn+"/front_default.png");

    var chi_yu = new smogon.Pokemon(gen, 'Chi-Yu', {chiyu_set})
    var pokemon_1 = new smogon.Pokemon(gen, pkmn_name, set)
    dmg_calc = smogon.calculate(gen, chi_yu, pokemon_1, new smogon.Move(gen, "Overheat"), new smogon.Field({weather:'Sun'}))
    dmg_perc = 100*(dmg_calc.damage[0]/dmg_calc.defender.stats.hp);
    console.log(dmg_calc)
    desc = [
        "252+ SpA Choice Specs Beads of Ruin Chi-Yu Overheat",
        dmg_calc.rawDesc.HPEVs + " / " + dmg_calc.rawDesc.defenseEVs + " " + dmg_calc.rawDesc.defenderItem + " " + dmg_calc.rawDesc.defenderName
    ]
    ui.push(new label(desc[0], w/4, h/2 + 96, 16, [0, 0, 0, 1]))
    ui.push(new label("VS", w/2, h/2, 32, [0, 0, 0, 1], 1))
    ui.push(new label(desc[1], 3*w/4, h/2 + 96, 16, [0, 0, 0, 1], 2))
    ui.push(new label("(in sun)", w/2, h/2 + 64, 16, [0, 0, 0, 1], 3))
    ui.push(new label("Is it a Guaranteed OHKO?: " + Math.floor(dmg_perc) + "%", w/2, h/8, 48, [0, 0, 0, 1], 4))
    
    loaded = true;
}

function draw()
{
    background(255);
    for(var i = 0; i < ui.length; i++)
    {
        ui[i].render()
    }
    if(loaded)
    {
        noSmooth();
        tint(255, ui[0].externalAlpha);
        image(chiyu_img, w/4 - 128, h/2 - 128, 256, 256);
        tint(255, ui[2].externalAlpha);
        image(pkmn_img, 3*w/4 - 128, h/2 - 128, 256, 256);
        tint(255);
    }

    
}



