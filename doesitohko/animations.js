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

function fullTitleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

function randomElement(list)
{
    return list[Math.round(Math.random()*(list.length - 1))]
}

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}

function getFireWeakness(type)
{
    var eff = 1;
    switch(type)
    {
        case "GRASS":
            eff = 2;
            break;
        case "ICE":
            eff = 2;
            break;
        case "BUG":
            eff = 2;
            break;
        case "STEEL":
            eff = 2;
            break;
        case "FIRE":
            eff = 0.5;
            break;
        case "WATER":
            eff = 0.5;
            break;
        case "ROCK":
            eff = 0.5;
            break;
        case "DRAGON":
            eff = 0.5;
            break;
        default:
            eff = 1;
            break;
    }
    return eff;
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
//From Bundle
function getHazards(gen, defender, defenderSide) {
    var damage = 0;
    var texts = [];
    if (defender.hasItem('Heavy-Duty Boots')) {
        return { damage: damage, texts: texts };
    }
    if (defenderSide.isSR && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
        var rockType = gen.types.get('rock');
        var effectiveness = rockType.effectiveness[defender.types[0]] *
            (defender.types[1] ? rockType.effectiveness[defender.types[1]] : 1);
        damage += Math.floor((effectiveness * defender.maxHP()) / 8);
        texts.push('Stealth Rock');
    }
    if (defenderSide.steelsurge && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
        var steelType = gen.types.get('steel');
        var effectiveness = steelType.effectiveness[defender.types[0]] *
            (defender.types[1] ? steelType.effectiveness[defender.types[1]] : 1);
        damage += Math.floor((effectiveness * defender.maxHP()) / 8);
        texts.push('Steelsurge');
    }
    if (!defender.hasType('Flying') &&
        !defender.hasAbility('Magic Guard', 'Levitate') &&
        !defender.hasItem('Air Balloon')) {
        if (defenderSide.spikes === 1) {
            damage += Math.floor(defender.maxHP() / 8);
            if (gen.num === 2) {
                texts.push('Spikes');
            }
            else {
                texts.push('1 layer of Spikes');
            }
        }
        else if (defenderSide.spikes === 2) {
            damage += Math.floor(defender.maxHP() / 6);
            texts.push('2 layers of Spikes');
        }
        else if (defenderSide.spikes === 3) {
            damage += Math.floor(defender.maxHP() / 4);
            texts.push('3 layers of Spikes');
        }
    }
    if (isNaN(damage)) {
        damage = 0;
    }
    return { damage: damage, texts: texts };
}