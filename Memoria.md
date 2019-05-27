

## Preparación

El proyecto consiste en realizar un tracker que tomes medidas de rendimiento de un juego en Phaser, el objetivo del tracker es facilitar a los desarrolladores la capacidad de medir el rendimiento de su juego también la posibilidad de obtener una información detallada de usuarios remotos y su rendimiento.
El tracker será implementado en JavaScript, para navegadores web.

### Arquitectura

El tracker está diseñado para usarse en la plataforma [phaser](https://phaser.io/), consta de dos partes el tracker que envia y guarda los datos por medio de servidor y el módulo de performance que manda todas las métricas.

### Funcionalidad

Nuestro tracker desarrolla una funcionalidad básica de tracking de mensajes personalizados por el usuario (cuando el usuario decide medir datos de su juego) y tracking de datos de rendimiento del usuario, que se explican más abajo.

Para decidir la funcionalidad a implementar en nuestro tracker, hemos decidido explotar al máximo los datos extraíbles de Phaser y del navegador.

Los datos de rendimiento que extrae el Tracker son:

- Numero de ficheros cargados, sus nombres y si han sido cargados con anterioridad
- Versión de Navegador
- Geolocalización del Usuario
- Tamaño de la ventana
- Tamaño de la pantalla del usuario
- Tiempo de carga para cada escena del juego
- FPS
- Sistema operativo
- Memoria usada por JS (solo en Chrome)

El objetivo es ayudar al desarrollador, por ejemplo con la carga de ficheros repetidos, los fps, el tiempo de carga de escenas etc pero lo que resulta mas interesante es la capacidad que tiene el desarrollador de obtener información de los jugadores remotamente, puede ver el rendimiento y ponerlo en un contexto (SO, navegador, ...) sin necesidad  de que el usuario reporte el fallo se puede reproducir con más facilidad el error o la bajada de rendimiento.



## Conclusiones
El navegador tiene muchas limitaciones a la hora de obtener informacion del sistema/usuario, hemos optimizado las pocas medidas otorgadas por el navegador y la muy útil información de Phaser. La característica principal de este módulo es la capacidad de poner en contexto características que afectan al rendimiento del navegador(version del navegador, tamaño de ventana, sistema operativo, ...), además optimizado para Phaser (tiempo de cambio de escena, FPS, ficheros cargados, ...) para medir y posteriormente poder optimizar la perfomance.

Como conclusión final, el tracker puede servir para obtener y enviar la información sobre el rendimiento y contexto de muchos usuarios, así facilitando la detección, solución de problemas y la optimización de recursos en Phaser.

---

## Referencias y bibliografía

- https://phaser.io
- https://technology.riotgames.com/
- https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
º
