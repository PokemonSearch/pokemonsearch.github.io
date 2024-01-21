const queryString = window.location.search.split("?");
const longQueryString = window.location.search.replace("%3E",">").replace("%3C","<").trim().split("?");

var poke_count = 1017;
var active_search = 0;
var done = 0;
var started = 0;
var total_list = {};
console.log(queryString)
if(queryString.length > 1)
{
    document.body.innerHTML += "processing query"
    run_script();
}
else
{
    document.body.innerHTML += "invalid parameters"
}

async function run_script()
{
    console.log("running script");

    await load();
    var tempList = []
    var sortMode = longQueryString[1]
    for(var i = 2; i < longQueryString.length; i++)
    {
        var set = evaluateArgument(longQueryString[i].trim().replace("%3E",">").replace("%3C","<"), total_list);
        tempList = tempList.concat(set)
    }
    
    var endList = []
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
                counts[ic.data.species.name] = counts[ic.data.species.name] ? counts[ic.data.species.name] + 1 : 1;
                names[ic.data.species.name] = ic;
            }
            var keys = Object.keys(counts);
            for(var c = 0; c < keys.length; c++)
            {
                var k = keys[c];
                if(counts[k] == longQueryString.length - 2){endList.push(names[k]);}
            }
            break;
    }
    console.log(endList)
    var list = []
    for(var i = 0; i < endList.length; i++)
    {
        list.push(endList[i].data.species.name);
    }
    document.body.innerHTML = "["+list.toString()+"]";
}

async function load()
{
    total_list = await fetch("../data/api/pregen.json").then((response) => response.json());
    return;
}

async function generate()
{
    while(done < poke_count)
    {
        if(active_search < 500)
        {
            started++;
            search(started);
            await new Promise(r => setTimeout(r, 1));
        }
    }
    console.log(total_list);
}

async function search(ID)
{
    active_search++;
    var val = await fetch("../data/api/"+ID+"/api.json").then((response) => response.json());
    done++;
    active_search--;
    total_list[ID] = {data:val};
    console.log(done/poke_count);
    
}
