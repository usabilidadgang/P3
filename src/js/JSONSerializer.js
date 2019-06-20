'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');

//Serializador a JSON, recibe un evento {Event} que cuenta con userId, timeStamp y eventInfo
class JSONSerializer
{
    serialize(newEvent)
    {
        return  JSON.stringify(newEvent)    
    }
}
module.exports = JSONSerializer;
