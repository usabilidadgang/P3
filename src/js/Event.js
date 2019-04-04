const EventType
{
  "SESSION_INIT": 1,
  "SESSION_CLOSE": 2,
  "PLAYER_POSITION": 3,
  "ENEMY_DEAD": 4,
  "LEVEL_INIT": 5,
  "LEVEL_CLOSE": 6
}

class Event
{
  constructor(time_stamp, event_type, eventInfo)
  {
    this.timeStamp = time_stamp;
    this.eventType = event_type;
    this.eventInfo = eventInfo;
  }
}
