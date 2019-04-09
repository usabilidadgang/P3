'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');
class CSVserializer
{
    serialize(newEvent)
    {
        if(eventCheck.isEventCorrect(newEvent))
        {
            var a =  newEvent.eventType.toString() + ", "+ newEvent.timeStamp + ", " + newEvent.eventInfo;
            return a;
        }
        else return "null";
    }
}
module.exports = CSVserializer;