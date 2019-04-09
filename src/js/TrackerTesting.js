'use strict'
const Tracker = require ('./Tracker');
const Event = require ('./Event');

var trackillo = new Tracker(0,0);

for(let i = 0; i < 10; i++)
{
    let evt = new Event("00:00:00", "ENEMY_DEAD", i.toString());
    trackillo.addEvent(evt);
}






