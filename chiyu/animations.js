function tween(x, start, end, power = 1)
{
    return (start - end)*(freeanim(x)**power) + end;
}

function titleCase(/**@type String */str)
{
    /**@type String */
    var base = str.toLowerCase()
    return base.charAt(0).toUpperCase() + base.slice(1);
}

function randomElement(list)
{
    return list[Math.round(Math.random()*(list.length - 1))]
}

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}