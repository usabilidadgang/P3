'use strict'
const event = require('./Event');
const eventCheck = require('./EventCheck');
class CSVserializer
{  
    serialize(newEvent)
    {
        return  newEvent.userId.toString() + ", "+ newEvent.eventType.toString() + ", "+ newEvent.timeStamp + "," + this.serializeEventInfo(newEvent.eventInfo); 
    }
    serializeEventInfo(eventInfo)
    {
        if(eventInfo == null) return "";
        var params = "";
        Object.values(eventInfo).forEach(property => {
            params+= property.toString() + " ";
        });
        return params;
    }
}
module.exports = CSVserializer;