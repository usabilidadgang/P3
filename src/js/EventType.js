'use strict'
var EventType = {
    SESSION_INIT :  0,
    SESSION_CLOSE:  1,
    PLAYER_POSITION:2,
    ENEMY_DEAD :    3,
    PLAYER_DEAD:    4,
    LEVEL_INIT :    5,
    LEVEL_FAIL:     6,
    LEVEL_SUCCEDED: 7
}

module.exports = EventType;