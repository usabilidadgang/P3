'use strict'
require("./Event.js")
static var SerializerJSON = {

    Serialize: function(event){
        var serializedEvent;

        serializedEvent = "{sesionID:"+event.sesionID+"}"
        
        return serializedEvent;
    }


};

/**
 * estrutura de CSV
 * idSesion,timeStamp,evenType,eventInfo
 */
static var SerializerCSV = {

    Serialize: function(event){    
        var serializedEvent;
        serializedEvent = "";
        serializedEvent.concat([event.sesionID,",",event.timeStamp,",",event.evenType,","]);
        
        if (event.evenType>3){
            serializedEvent.concat(["x ",event.evenInfo.x," y ",event.evenInfo.y]);
        }else{
            serializedEvent.concat("");
        }

        return serializedEvent;
    }


};

module.exports = {
    SerializerCSV:SerializerCSV,
    SerializerJSON:SerializerJSON
}