'use strict'
var EventType = {
    SESSION_INIT: 0, //Inicio de la sesión
    SESSION_CLOSE:  1, //Fin de la sesión
    PLAYER_POSITION:2, //Posición del jugador
    ENEMY_DEAD :    3, //Muerte de enemigo
    PLAYER_DEAD:    4, //Muerte del jguador
    LEVEL_INIT :    5, //Inicio del nivel
    LEVEL_FAIL:     6, //Nivel fallido
    LEVEL_SUCCEDED: 7 //Nivel completado con éxito
}

module.exports = EventType;