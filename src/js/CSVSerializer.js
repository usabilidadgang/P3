'use strict'
const event = require('./Event');
class CSVserializer
{
    //Recibe un evento {Event} que cuenta con userId, timeStamp y eventInfo
    serialize(newEvent)
    {
        return  newEvent.userId.toString() + ", "+ newEvent.eventType.toString() + ", "+ newEvent.timeStamp + "," + this.serializeEventInfo(newEvent.eventInfo); 
    }
    //Funcion auxiliar para serializar la parte de {Event.eventInfo}
    serializeEventInfo(eventInfo)
    {
        if(eventInfo == null) return"\"\"";
        var params = "";

        Object.values(eventInfo).forEach(property => {
            params+= property.toString() + ",";
        });
        return "\"" + params.substr(0,params.length-1)+"\"";
    }
}
module.exports = CSVserializer;