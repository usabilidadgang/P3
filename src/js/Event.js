'use strict'
const EventType =
{
  SESSION_INIT: 0,
  SESSION_CLOSE: 1,
  LEVEL_INIT: 2,
  LEVEL_CLOSE: 3,
  ENEMY_DEAD: 4,
  PLAYER_POSITION: 5,
  PLAYER_DEAD: 6,
}

class Event
{
  constructor(time_stamp, event_type, eventInfo,sesion_ID)
  {
    this.timeStamp = time_stamp;
    this.eventType = event_type;
    this.eventInfo = eventInfo;
    this.sesionID = sesion_ID;
  }
}

module.exports = {
  Event:Event,
  EventType:EventType
}