# [insertar nombre juego]

Por
[Manuel Hernández](https://github.com/manherna) y [Francisco Solano López-Bleda](https://github.com/franlbc97).
## Resumen
[generador tablas](http://www.tablesgenerator.com/markdown_tables#) por si aca 

| Genero         | Público | Modos de juego | Plataforma |
|----------------|---------|----------------|------------|
| Plataformas 2D | yo      | 1 Jugador      | navegador  |
## Descripción
una puta ida de olla
## Jugabilidad
### Mecanica
robotica
### Dinámica
movil
### Estetica
bonica
## Menús
### Menú principal
y tho
### Menú de pausa
pa que quires saber eso
### Creditos
puto lilo
### Menu N-esimo
imbecil
## Historia
salva a la animadora, salva el mundo
## Personajes
### La madre de manu en moniciclo
tambien toca la guitarra
### La Puta Madre de Manu en monociclo
que toca el bajo
## Niveles
mu chungos porque semos jarcores
## Installation

### Requirements

This games uses [gulp](http://gulpjs.com/) for building and tasks automation.

You can install gulp with npm:

```
npm install -g gulp
```

### Build

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

