'use strict'
const Tracker = require ('./Tracker');
const Event = require ('./Event');

var trackillo = new Tracker(1,1);

for(let i = 0; i < 15; i++)
{
    trackillo.addEvent("ENEMY_DEAD", i);
}






