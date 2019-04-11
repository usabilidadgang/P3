'use strict'
const EventType = require('./EventType')
module.exports = {
    isEvent : function(eventCheck)
  {
    if (eventCheck.userId == null)return false;
    else if(eventCheck.eventType == null) return false;
    else if(eventCheck.eventInfo == null)return false;
    else if(eventCheck.eventInfo == null)return false;

    else return true;
  },
  isEventCorrect: function(eventCheck)
  {
    if(!this.isEvent(eventCheck))return false;
    else
    {
      let correct = false;
      if(EventType[eventCheck.eventType] >= 0 && EventType[eventCheck.eventType] <= 5)correct = true;
      return correct;

    }
  }
}