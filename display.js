
//const { Renderer } = require("../../../../.vscode/extensions/samplavigne.p5-vscode-1.2.12/p5types");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
var version = "0.3"
var w = window.innerWidth;
var h = window.innerHeight;
const MAX_ID = 1010; //[number of pokemon]
var fin = 0;
var font_pixeloid;
var initialized = false;
var scrolling = 0;
var clicked = true;
var targetScroll = 0;
var icons = []
var textBuffer = []
var viewrange = [0, 0];
/**@type Panel */
var pokemonDisplay;
/**@type TextBox */
var searchBar;
var sortButton;
var loadButton;
var helpButton;
var cachedSearch = "";
var sortMode = "OR";
var loadMode = "SAFE";
var selectedElement = null;
var chosenIcons = [];
var running = 0;
var overlay = false;
var finishedLoading = 0;
var helpText = "";
function setup()
{
    textLeading(20); //default is 20
    var barReduction = w/4
    searchBar = new TextBox(barReduction/2, 10, w - barReduction, 30);
    sortButton = new Button(barReduction/2 + searchBar.width + 20, 15, 100, 30, color(100, 100, 120), color(255, 255, 255), toggleMode);
    helpButton = new Button(sortButton.pos.x + sortButton.width + 20, 15, 60, 30, color(100, 100, 120), color(255, 255, 255), swapOverlay);
    helpButton.text = "?"
    loadButton = new Button(sortButton.pos.x + 20, 15, 100, 30, color(100, 100, 120), color(255, 255, 255), swapLoading);
    pokemonDisplay = new Panel(600);
    viewrange = [0, h];
    font_pixeloid = loadFont("fonts/bw2 (t&i)(edited).ttf")
    canvas = createCanvas(w, h);
    canvas.position(0,0);
    canvas.style("display","block");
    textAlign(LEFT, TOP);
    init()

    helpText = `This website was designed to be used as a tool to sort Pokemon by their various attributes. 
You can also take a look at each one by clicking on it, and the menu can be closed by clicking on the same Pokemon icon. 
Using the search bar, the list of Pokemon can be filtered. Each filter should contain no spaces and every filter should be seperated by a singular space. (i.e: "atk>70 hp<60 gen=5")
The button at the side can switch from "OR" mode and "AND" mode. 
In "OR" mode, Pokemon will be hidden if they do not fit ANY of the filters. 
In "AND" mode, Pokemon will be hidden if they do not fit ALL of the filters.
The list of available filters includes:
`
    keys = Object.keys(operators);
    for(var o = 0; o < keys.length; o++)
    {
        if(o > 0 && operators[keys[o]] == operators[keys[o - 1]]){continue;}
        helpText += '\n"' + keys[o] + '": ' + desc[operators[keys[o]].name]
    }

}

function swapLoading()
{
    switch(loadMode)
    {
        case "SAFE":
            loadMode = "FAST";
            break;
        case "FAST":
            loadMode = "SAFE";
            break;
    }
}

function swapOverlay()
{
    overlay = !overlay;
}

function analysis()
{
    cachedSearch = searchBar.text;
    if(cachedSearch == "")
    {
        chosenIcons = icons;
    }
    else
    {
        var tempList = []
        var args = searchBar.text.trimEnd().trimStart().split(" ");
        for(var i = 0; i < args.length; i++)
        {
            tempList = tempList.concat(evaluateArgument(args[i], icons));
        }
        var endList = []
        if(tempList.length == 0)
        {
            endList = icons;
        }
        else
        {
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
                        console.log(ic);
                        counts[ic.name] = counts[ic.name] ? counts[ic.name] + 1 : 1;
                        names[ic.name] = ic;
                        console.log(counts[ic.name]);
                    }
                    console.log(counts);
                    var keys = Object.keys(counts);
                    for(var c = 0; c < keys.length; c++)
                    {
                        k = keys[c];
                        console.log(k + ": " + counts[k])
                        if(counts[k] == args.length){endList.push(names[k]);}
                    }
                    break;
            }
            
        }
        chosenIcons = endList;
    }
}

async function init()
{
    for(var i = 1; i < MAX_ID + 1; i++)
    {
        icons.push(new PokeIcon(i))
        while(running > 2 + (loadMode == "FAST" ? 18 : 0))
        {
            await delay(1)
        }
    }
    analysis();
}

function draw()
{
    background(20, 20, 20);
    textFont(font_pixeloid);
    noSmooth();
    viewrange = [pokemonDisplay.y + pokemonDisplay.height, h];
    var buffer = 10
    var size = 100
    var rowSize = (9*(200/size)*(w/1920)) - 1;
    var finalRow = Math.floor((chosenIcons.length - 1)/rowSize) + 1;
    var fullHeight = 10 + size*(finalRow + 1) + buffer*finalRow - h + pokemonDisplay.y + pokemonDisplay.height;
    var rowLength = 10 + size*rowSize + buffer*rowSize;
    if(targetScroll < 0)
    {
        targetScroll = 0;
    }
    if(targetScroll > fullHeight)
    {
        targetScroll = fullHeight;
    }
    scrolling += 0.01*deltaTime*(targetScroll - scrolling)

    if(cachedSearch == "")
    {
        chosenIcons = icons;
    }
    
    if(cachedSearch != searchBar.text)
    {
        analysis();
    }


    for(var i = 0; i < chosenIcons.length; i++)
    {
        if(chosenIcons[i] == null){continue;}
        var row = Math.floor(i/rowSize);
        var x = 10 + size*i + buffer*i - row*(size*rowSize + buffer*rowSize)
        var y = 10 + size*(row + 1) + buffer*row - scrolling + pokemonDisplay.y + pokemonDisplay.height;
        if(rendererd(y, size))
        {
            tint(255, 255, 255, 255);
            fill(30, 30, 30)
            rect(x, y, size, size, 20)
            if(chosenIcons[i] != null)
            {
                chosenIcons[i].render(x, y, size)
            }
        }
    }
    pokemonDisplay.render();
    for(var i = 0; i < textBuffer.length; i++)
    {
        t = textBuffer[i];
        instant_text(t[0],t[1],t[2],t[3],t[4],t[5])
    }
    textBuffer = []
    searchBar.render();
    sortButton.text = sortMode;
    sortButton.render();


    if(overlay)
    {
        background(0, 0, 0, 200)

        fill(40, 40, 40)
        var overlayX = w/16
        var overlayY = h/8
        rect(overlayX, overlayY, (w - 2*overlayX), (h - 2*overlayY), (w/20 + h/20)/2);
        var oX = overlayX + (w/20 + h/20)/2;
        var oY = overlayY + (w/20 + h/20)/2 - 25;
        textSize(29*0.7)
        instant_text("Welcome to CheeseMan's JSDex Data Base!", 29*0.7, w/2, overlayY + textAscent()/2 - 15, color(255), true);
        textLeading(27);
        instant_text(helpText, 23*0.7, oX, oY - 5, color(255), false);
        textLeading(20);
    }
    helpButton.render();


    var loadingPercent = Math.round((finishedLoading/MAX_ID)*100);
    var loadText = ""
    var baseHeader = "JSDex ( v" + version + " )\n\n(Data/Sprites sourced from PokeAPI)"
    if(loadingPercent < 100)
    {
        loadText = " (Loading: " + loadingPercent + "%)"
        loadButton.pos.x = textWidth(baseHeader + "( 100% )") - 30;
        loadButton.pos.y = 10 + textAscent()*2 + loadButton.height/4;
        loadButton.text = loadMode;
        loadButton.render();
    }
    var header = baseHeader + loadText;
    fill(255,0,0);
    instant_text(header, 29*0.7, 10, -10);

    if(clicked){clicked = false;}
}

function instant_text(string, size, x, y, colour = color(255), middle = false)
{
    noSmooth()
    textSize(size)
    fill(colour)
    strokeWeight(0)
    var offX = 0;
    if(middle){offX = textWidth(string)/2}
    text(string, x - offX, y + textAscent())
    fill(255)
    smooth()
}

function buffer_text(string, size, x, y, colour = color(255), middle = false)
{
    textBuffer.push([string, size, x, y, colour, middle])
}

function rendererd(top, height)
{
    return (top + height > viewrange[0] && top < viewrange[1]);
}

function mouseWheel(event) {
    //move the square according to the vertical scroll amount
    targetScroll += event.delta;
    //uncomment to block page scrolling
    //return false;
}

function mouseClicked() 
{
    clicked = true;
}

function keyPressed() 
{

}



