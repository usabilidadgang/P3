# Tracker de Rendimiento en JS
Por:


Jorge Algaba Aranda

Manuel Hernández Nájera-Alesón

Francisco Solano López-Bleda de Castro

---

## Preparación

Este proyecto consiste en realizar un tracker que tomes medidas de rendimiento del juego en cuestion.
Dicho tracker será implementado en JavaScript, para navegadores web.
Para el proyecto hemos decido usar como base el tracker realizado en la práctica 3. Este tracker será modificado y mejorado respecto a la anterior práctica.

### Arquitectura

El proyecto se planteó en un primer momento como un tracker modular, con 3 modulos. Pero debido a complicaciones tecnicas decidimos centrar el desarrollo en un único tracker destinado especificamente para la plataforma [phaser](https://phaser.io/)  

### Funcionalidad

Nuestro tracker desarrolla una funcionalidad básica de tracking de mensajes personalizados por el usuario (cuando el usuario decide medir datos de su juego) y tracking de datos de rendimiento del usuario, que se explican más abajo.

Para decidir la funcionalidad a implementar en nuestro tracker, hemos decidido explotar al máximo los datos extraíbles de Phaser y del navegador.

Los datos de rendimiento que extrae el Tracker son:

- Numero de ficheros cargados, sus nombres y si han sido cargados con anterioridad
- Versión de Navegador
- Geolocalización del Usuario
- Tamaño de la ventana
- Tiempo de carga para cada escena del juego
- FPS
- Ping del usuario


## Conclusiones

## Referencias y bibliografía

- https://phaser.io
- https://technology.riotgames.com/


