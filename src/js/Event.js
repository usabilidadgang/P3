'use strict'


class Event
{
  constructor(userId, time_stamp, event_type, eventInfo)
  {
    this.userId = userId;
    this.timeStamp = time_stamp;
    this.eventType = event_type;
    this.eventInfo = eventInfo;
  }
}

module.exports = Event;
