'use strict'

/**
 * Clase del evento
 */
class Event
{
  /**
   * Constructor principal de la clase
   * @param {String} userId ID del usuario
   * @param {Number} time_stamp Fecha en EPOC para indicar la creacion del evento
   * @param {EventType} event_type Tipo de Evento
   * @param {Object} eventInfo Información adicional del evento 
   * 
   */
  constructor(userId, time_stamp, event_type,  eventInfo)
  {
    this.userId = userId;
    this.timeStamp = time_stamp;
    this.eventType = event_type;
    this.eventInfo = eventInfo;
    this.eventId = 0; 
  }
}



module.exports = Event;
