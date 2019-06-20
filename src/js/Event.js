'use strict'


class Event
{
  constructor(userId, time_stamp, event_type, eventInfo)
  {
    this.userId = userId; //Id de usuario
    this.timeStamp = time_stamp;//Tiempo en EPOCH de creación del evento
    this.eventType = event_type;//Tipo de evento (1-7)
    this.eventInfo = eventInfo;// Información adicional del evento como valor de la posición
  }
}

module.exports = Event;
