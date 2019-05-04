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
Se Realizaran los siguientes modulos para obtener información:

#### PerformanceInfo
Este modulo se encargará de sacar las metricas de rendimiento.
Las métricas de rendimiento que se quieren obtener son las siguientes:
- Carga de CPU
- Carga de RAM
- FPS
- Ancho de banda[^red]
- Cantidad de RAM
- Procesador
- Ping a un servidor[^red]

[^red]: Aunque nuestro juego no tenga capacidad online el tracker si que tendrá la capacidad de consultar métricas de red

#### UserInfo
Este modulo se encargará de sacar las metricas sobre el usuario.
Las métricas sobre el usuario que se quieren obtener son las siguientes:
- Ubicación(basado en la IP)
- Navegador usado
- Sistema Operativo

## Conclusiones

## Referencias y bibliografía



