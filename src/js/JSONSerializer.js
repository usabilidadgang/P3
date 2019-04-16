'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');

class JSONSerializer
{
    serialize(newEvent)
    {
        return  JSON.stringify(newEvent)    
    }
}
module.exports = JSONSerializer;
