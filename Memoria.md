# Tracker de Rendimiento en JS en Phaser

Grupo 6 :
- Jorge Algaba Aranda
- Manuel Hernández Nájera-Alesón
- Francisco Solano López-Bleda de Castro

----

## Preparación

Este proyecto consiste en realizar un tracker que tome medidas de rendimiento para Phaser.
Dicho tracker será implementado en JavaScript, para navegadores web.
Para el proyecto hemos decido usar como base el tracker realizado en la práctica 3. Este tracker será modificado y mejorado respecto a la anterior práctica.

### Arquitectura

El proyecto se planteó en un primer momento como un tracker modular, con 3 modulos. Pero debido a complicaciones tecnicas decidimos centrar el desarrollo en un único tracker destinado especificamente para la plataforma [Phaser](https://phaser.io/) en navegador.

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

---


## Conclusiones
El navegador tiene muchas limitaciones a la hora de obtener informacion del sistema/usuario, nos hemos basado en las pocas medidas otorgadas por el navegador y la información obtenible por Phaser. La característica principal de este módulo es la capacidad de poner en contexto características que afectan al rendimiento del navegador(version del navegador, tamaño de ventana, sistema operativo, ...), además optimizado para Phaser (tiempo de cambio de escena, FPS, ficheros cargados, ...).

Como conclusión final, el tracker puede servir para obtener y enviar la información sobre el rendimiento y contexto de muchos usuarios, así facilitando la detección, solución de problemas y la optimización de recursos en Phaser.

---

## Referencias y bibliografía

- https://phaser.io
- https://technology.riotgames.com/


