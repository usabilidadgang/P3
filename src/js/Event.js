'use strict'


class Event
{
  constructor(time_stamp, event_type, eventInfo)
  {
    this.timeStamp = time_stamp;
    this.eventType = event_type;
    this.eventInfo = eventInfo;
  }
}

module.exports = Event;
