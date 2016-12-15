# [insertar nombre juego]

posibles nombres\:
- Rex Vult (el rey lo quiere en latin, referencia a deus vult)
- Castrum sine Rex (Rey sin castillo en latin)
- Rex ad Golem (El rey contra el Golem, el latin)

Por
[Manuel Hernández](https://github.com/manherna) y [Francisco Solano López-Bleda](https://github.com/franlbc97).
## Resumen
[generador tablas](http://www.tablesgenerator.com/markdown_tables#) por si aca 

| Genero         | Público | Modos de juego | Plataforma |
|----------------|---------|----------------|------------|
| Plataformas 2D | yo      | 1 Jugador      | navegador  |
## Descripción
Goldem Golem le ha quitado a el Rey Oswald III su castillo y este intentará recuperarlo.
## Jugabilidad
### Mecanica
- Rey Oswald III
  + Movimiento en el eje x mediante las flechas del teclado.
  + Salto: Con la barra espaciadora.
  + Le afectan las leyes de la fisica.
- Serpiente
  + Movimiento en el eje X y automático.
  + No le afectan las leyes de la física.
- Golden Golem
  + Movimiento libre en los ejes X e Y, automático.
  + No le afectan las leyes de la física.

### Dinámica
- Rey Oswald III
  + Muere
    - Ser tocado por un enemigo.
    - Al caer en la lava/ agua nos matará.
  + Obtiene puntos
    - Al matar a una serpiente.
    - Pasarse el nivel.
    - Coger cofres.
  + Obtiene una vida cuando coge un 1UP.
- Serpiente
  + Muere al ser aplastada por Oswald.
- Golden Golem
  + Pierde vida al ser yoqse por Oswald.
  + Muere al tener 0 vidas.

### Estetica
16 bits. Fantasía medieval.
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
Goldem Golem le ha quitado a el Rey Oswald III su castillo y este intentará recuperarlo.
## Personajes
### Rey Oswald III
A quien ha sido arrebatado su castillo
### Golden Golem
Que ha robado el castillo del Rey Oswald. Es el malvado villano.
### Serpientes
Súbditos del golem dorado.
## Niveles
### 1º Nivel: Fuera del castillo.
Habremos de llegar desde las afueras del castillo hasta su puerta, esquivando a las serpientes.
### 2º Nivel: Dentro del castillo.
Lucha contra serpientes y contra el malvado golem.

***
## Installation
Initial scaffolding generated with [generator-gamejam](https://github.com/belen-albeza/generator-gamejam/).

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

