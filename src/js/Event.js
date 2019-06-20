'use strict'


class Event
{
  constructor(userId, time_stamp, event_type, eventInfo)
  {
    this.userId = userId; //Id de usuario
    this.timeStamp = time_stamp;//Tiempo en EPOCH de creaci�n del evento
    this.eventType = event_type;//Tipo de evento (1-7)
    this.eventInfo = eventInfo;// Informaci�n adicional del evento como valor de la posici�n
  }
}

module.exports = Event;
