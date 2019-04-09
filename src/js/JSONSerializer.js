'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');

class JSONSerializer
{
    serialize(newEvent)
    {
        if(eventCheck.isEventCorrect(newEvent))
        {
            return  JSON.stringify(newEvent)
        }
        else return "null";
    }
}
module.exports = JSONSerializer;
