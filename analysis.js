function count(/**@type String */str, /**@type String */seg)
{
    return (str.match(new RegExp(str)) || []).length;
}

function setMode(value)
{
    if(value == "OR"){sortMode = "OR";}
    if(value == "AND"){sortMode = "AND";}
}

function toggleMode()
{
    switch(sortMode)
    {
        case "OR":
            sortMode = "AND";
            break;
        case "AND":
            sortMode = "OR";
            break;
    }
    analysis()
}

function checkWeight(icon, comp, value)
{
    switch(comp)
    {
        case "=":
            return icon.data.weight == value;
        case ">":
            return icon.data.weight > value;
        case "<":
            return icon.data.weight < value;
    }
}

function checkForms(icon, comp, str_value)
{
    value = Number(str_value) - 1
    switch(comp)
    {
        case "=":
            return icon.forms.length == value;
        case ">":
            return icon.forms.length > value;
        case "<":
            return icon.forms.length < value;
    }
}

function checkType(icon, comp, value)
{
    if(comp == "=")
    {
        if(icon.data.types.length == 1)
        {
            return icon.data.types[0].type.name == value
        }
        else
        {
            return icon.data.types[0].type.name == value || icon.data.types[1].type.name == value;
        }
        
    }
    return false;
}

function checkName(icon, comp, value)
{
    if(comp == "=")
    {
        return icon.data.name == value;
    }
    else
    {
        return icon.data.name.includes(value);
    }
}

function checkCol(icon, comp, value)
{
    if(comp == "=")
    {
        return icon.spec_data.color.name == value;
    }
    else
    {
        return false;
    }
}

function getBST(stats)
{
    var total = 0;
    for(var i = 0; i < 6; i++)
    {
        total += stats[i].base_stat
    }
    return total;
}

function checkStat(icon, comp, str_value, statID)
{
    value = Number(str_value)
    if(statID == 6) //BST
    {
        var bst = getBST(icon.data.stats);
        switch(comp)
        {
            case "=":
                return bst == value;
            case ">":
                return bst > value;
            case "<":
                return bst < value;
        }
        return false;
    }
    switch(comp)
    {
        case "=":
            return icon.data.stats[statID].base_stat == value;
        case ">":
            return icon.data.stats[statID].base_stat > value;
        case "<":
            return icon.data.stats[statID].base_stat < value;
    }
    return false;
}

function checkHP(icon, comp, value){return checkStat(icon, comp, value, 0);}
function checkAtk(icon, comp, value){return checkStat(icon, comp, value, 1);}
function checkDef(icon, comp, value){return checkStat(icon, comp, value, 2);}
function checkSpA(icon, comp, value){return checkStat(icon, comp, value, 3);}
function checkSpD(icon, comp, value){return checkStat(icon, comp, value, 4);}
function checkSpe(icon, comp, value){return checkStat(icon, comp, value, 5);}
function checkBST(icon, comp, value){return checkStat(icon, comp, value, 6);}

function checkCR(icon, comp, value)
{
    switch(comp)
    {
        case "=":
            return icon.spec_data.capture_rate == value;
        case ">":
            return icon.spec_data.capture_rate > value;
        case "<":
            return icon.spec_data.capture_rate < value;
    }
}

var operators = 
{
    "name":checkName,
    "type":checkType,
    "color":checkCol,
    "colour":checkCol,
    "weight":checkWeight,
    "hp":checkHP,
    "atk":checkAtk,
    "def":checkDef,
    "spa":checkSpA,
    "spd":checkSpD,
    "spe":checkSpe,
    "bst":checkBST,
    "capture":checkCR,
    "forms":checkForms,
}

function evaluateArgument(/**@type String */arg, /**@type [PokeIcon] */iconList)
{
    arg = arg.toLowerCase();
    var keys = Object.keys(operators);
    var hasOperator = false;
    var operator = "";
    var comparator = ""
    var value = "";
    var possibleComps = ["=",">","<"]
    for(var i = 0; i < keys.length; i++)
    {
        var k = keys[i];
        if(arg.includes(k))
        {
            if(hasOperator){return [];} //check if there are multiple operators
            if(!hasOperator){hasOperator = true};  
            if(arg[arg.indexOf(k)] == arg.length - 1){return [];} //check if operator is at end
            if(arg[arg.indexOf(k)] == arg.length - 2){return [];} //check if comparator is at end
            if(!possibleComps.includes(arg.charAt(arg.indexOf(k) + k.length))){return [];} //check if there is valid comparator
            operator = k;
            comparator = arg.charAt((arg.indexOf(k) + k.length));
            value = arg.substring((arg.indexOf(k) + k.length) + 1);
        }
    }
    if(!hasOperator){operator = "name"; comparator = ""; value = arg;}
    var finalList = []
    for(var i = 0; i < iconList.length; i++)
    {
        if(!iconList[i].hasData){continue;}
        if(operators[operator](iconList[i], comparator, value))
        {
            finalList.push(iconList[i]);
        }
    }
    return finalList;
}