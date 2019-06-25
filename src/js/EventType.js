'use strict'
/**
 * Los tipos de eventos definidos
 */
var EventType = {
    /**
     * Inicio de sesion
     */
    SESSION_INIT: 0,
    /**
     * Fin de la sesión
     */
    SESSION_CLOSE:  1,
    /**
     * Posición del jugador
     */
    PLAYER_POSITION:2,
    /**
     * Enemigo muerto
     */
    ENEMY_DEAD :    3, 
    /**
     * Jugador muerto
     */
    PLAYER_DEAD:    4, 
    /**
     * Nivel comenzado
     */
    LEVEL_INIT :    5, 
    /**
     * Nivel fracasado
     */
    LEVEL_FAIL:     6, 
    /**
     * Nivel Completado
     */
    LEVEL_SUCCEDED: 7   
}

module.exports = EventType;