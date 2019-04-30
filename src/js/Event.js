'use strict'

/**
 * Types of Event
 */
const EVENT_TYPE = {
  GAME_EVENT: 0,
  PERFORMANCE_EVENT: 1,
}

/**
 * Event Class
 */
class Event
{
  /**
   * Main constructor of the Event Class
   * @param {string} userId 
   * @param {int} time_stamp 
   * @param {int} event_type
   * @param {int} event_id 
   * @param {Object} eventInfo 
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
