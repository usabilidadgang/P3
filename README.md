# Rex Vult

Por
[Manuel Hernández](https://github.com/manherna) y [Francisco Solano López-Bleda](https://github.com/franlbc97).
## Resumen
[generador tablas](http://www.tablesgenerator.com/markdown_tables#) por si aca 

| Genero         | Público | Modos de juego | Plataforma | calificación |
|----------------|---------|----------------|------------| -------- |
| Plataformas 2D | 10-88 años, casual      | 1 Jugador      | navegador  | Todas las edades |
## Descripción
Golden Golem le ha quitado a el Rey Oswald III su castillo y este intentará recuperarlo.
## Jugabilidad
### Mecanica
Tu eres el Rey Oswald III, puedes saltar y moverte por el mapa, mediante las flechas de dirección, mueres cuando te toca un enemigo o caes a un foso, mostrandose la pantalla de fin de juego, también puede obtener puntos cogiendo cofres. La serpiente te persigue cuando estas dentro de su rango, pero no puede saltar y muere al ser aplastada. El Golem lanza cosas y se mueve de lado a lado, y muere cuando se pisa 3 veces. Si se Pulsa P se pausará el juego.
### Dinámica
Llegar al final del mapa es el objetivo del juego
### Estetica
16 bits. Fantasía medieval.
## Menús
- Menú principal: se puede acceder a los creditos, al juego, o la cuenta de github del grupo
- Créditos
- Menu de Pausa
- Selección de nivel (probablemente)

## Historia
Golden Golem le ha quitado a el Rey Oswald III su castillo, por conveniencia de guión, y este intentará recuperarlo.
## Personajes
- Rey Oswald III
  - A quien ha sido arrebatado su castillo
- Golden Golem
  - Que ha robado el castillo del Rey Oswald. Es el malvado villano.
- Serpientes
  - Súbditos del golem dorado.

***
creo que esto puede valer.
# Arquitectura
- Personaje
  + Cualidades
    - Movimiento en el Eje X.
    - Puede morir y tiene vidas.
  + Hijos
    - Rey Oswald
      + Se mueve por el input del usuario (flechas de dirección).
      + Salta.
      + Coge objetos.
    - Enemigos
      + Cualidades
        - Hacen daño a Oswald.
        - No les afectan las leyes de la fisica.
        - tienen inteligencia artificial.
      + Hijos
        - Golden Golem
          + Tiene 3 vidas.
          + Se mueve libremente por el eje X e Y.
        - Serpiente
          + Tiene 1 vida.
          + Al Morir da puntos.
- Objeto
  + Cualidades
    - Pueden ser cogidos por Oswald
  + Hijos
    - 1UP
      + Desaparece al ser cogido.
      + Da 1 vida.
    - Cofre
      + No desaparece al ser cogido pero solo se puede coger 1 vez.
      + Da puntos.

***
# Installation
Initial scaffolding generated with [generator-gamejam](https://github.com/belen-albeza/generator-gamejam/).

## Requirements

This games uses [gulp](http://gulpjs.com/) for building and tasks automation.

You can install gulp with npm:

```
npm install -g gulp
```

## Build

Clone this repository and install dependencies:

```
git clone gituser/awesome-game
cd awesome-game
npm install
```

To **build** the game, run the `dist` task from the project root:

```
gulp dist
```

The `dist` folder will contain a build of the game. You can then start a local server that serves this directory statically to play the game in local:

```
npm install -g http-server
http-server dist
```

You can **clean up** the temporary files and the `dist` folder by running:

```
gulp clean
```

## Development

This project uses [Browserify](http://browserify.org) to handle JavaScript modules.

There is a task that will automatically run Browserify when a JavaScript file changes, and it will also reload the browser.

```
gulp run
```





You can deploy to **Github Pages** with the `deploy:ghpages` task, which will build the project and then push the `dist` folder in the `gh-pages` branch.

```
gulp deploy:ghpages
```

