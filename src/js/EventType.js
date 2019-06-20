'use strict'
var EventType = {
    SESSION_INIT: 0, //Inicio de la sesi�n
    SESSION_CLOSE:  1, //Fin de la sesi�n
    PLAYER_POSITION:2, //Posici�n del jugador
    ENEMY_DEAD :    3, //Muerte de enemigo
    PLAYER_DEAD:    4, //Muerte del jguador
    LEVEL_INIT :    5, //Inicio del nivel
    LEVEL_FAIL:     6, //Nivel fallido
    LEVEL_SUCCEDED: 7 //Nivel completado con �xito
}

module.exports = EventType;