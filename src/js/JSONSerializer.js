'use strict'
/**
 * Clase para la serialización de eventos a formato JSON
 */
class JSONSerializer
{
    /**
     * Serializa el evento en formato JSON
     * @param {Event} newEvent evento a serializar
     * @returns {String} El evento serializado en formato JSON
     */
    serialize(newEvent)
    {
        return JSON.stringify(newEvent)    
    }
}
module.exports = JSONSerializer;
