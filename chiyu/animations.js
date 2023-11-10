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


//From Module File
function getBerryResistType(berry) {
    switch (berry) {
    case 'Chilan Berry':
      return 'Normal';
    case 'Occa Berry':
      return 'Fire';
    case 'Passho Berry':
      return 'Water';
    case 'Wacan Berry':
      return 'Electric';
    case 'Rindo Berry':
      return 'Grass';
    case 'Yache Berry':
      return 'Ice';
    case 'Chople Berry':
      return 'Fighting';
    case 'Kebia Berry':
      return 'Poison';
    case 'Shuca Berry':
      return 'Ground';
    case 'Coba Berry':
      return 'Flying';
    case 'Payapa Berry':
      return 'Psychic';
    case 'Tanga Berry':
      return 'Bug';
    case 'Charti Berry':
      return 'Rock';
    case 'Kasib Berry':
      return 'Ghost';
    case 'Haban Berry':
      return 'Dragon';
    case 'Colbur Berry':
      return 'Dark';
    case 'Babiri Berry':
      return 'Steel';
    case 'Roseli Berry':
      return 'Fairy';
    default:
      return undefined;
    }
  }