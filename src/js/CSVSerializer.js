'use strict'
/**
 * Clase para la serialización de eventos a formato CSV
 */
class CSVserializer
{
    /**
     * Serializa el evento en formato CSV 
     * @param {Event} newEvent el evento a serializar
     * @returns {String} El evento serializado
     */
    serialize(newEvent)
    {
        return  newEvent.userId.toString() + ", "+ newEvent.eventType.toString() + ", "+ newEvent.timeStamp + "," + this.serializeEventInfo(newEvent.eventInfo); 
    }
    //
    /**
     * Funcion auxiliar para serializar la informacion del evento
     * @param {Event.eventInfo} eventInfo Informacion del evento
     * @returns {String} la información del evento procesado para CSV
     */
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