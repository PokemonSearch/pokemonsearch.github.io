var dex = require('@pkmn/dex');
var generations = require('@pkmn/data');
var smogon = require('@pkmn/smogon');
var calc = require('@smogon/calc')
var LL_smogon = require('smogon')
var cors_anywhere = require('cors-anywhere')

global.window.dex = dex
global.window.generations = generations
global.window.smogon = smogon
global.window.LL_smogon = LL_smogon
global.window.cors_anywhere = cors_anywhere
global.window.calc = calc
