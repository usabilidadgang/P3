'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');
class CSVserializer
{
    serialize(newEvent)
    {
        if(eventCheck.isEventCorrect(newEvent))
        {
            return  newEvent.userId.toString() + ", "+ newEvent.eventType.toString() + ", "+ newEvent.timeStamp + ", " + newEvent.eventInfo; 
        }
        else return "null";
    }
}
module.exports = CSVserializer;