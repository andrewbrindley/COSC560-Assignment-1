import {findPaths} from './util';


class Controller{
    playing: boolean
    turn: number
    game: Game

    constructor(){
        this.playing = false
        this.turn = 0;
        this.game = new Game(this.turn, 10, 10);
        document.getElementById('switch')?.addEventListener('click', _ => {
            this.turn = (this.turn + 1) % 2;
            const element = document.getElementById('start');
            if (element) element.style.backgroundColor = !this.turn ? '#000000' : '#FFFFFF';
        });

        document.getElementById('switch')?.addEventListener('click', _ => {
            this.turn = (this.turn + 1) % 2;
            const element = document.getElementById('start');
            if (element) element.style.backgroundColor = this.turn ? '#000000' : '#FFFFFF';
        });
    }

    activateMenu(){
        const menu = document.getElementById('modal');
        if (menu) menu.style.visibility = 'visible';
    }
}


class Game{
    turn: number
    start: number
    header: Header
    grid: Grid
    gameOver: boolean
    placed: number

    constructor(turn: number, rows: number, columns: number){
        this.turn = turn;
        this.start = turn;
        this.header = new Header(() => this.restart());
        this.grid = new Grid(rows, columns, this.tileClicked);
        this.gameOver = false;
        this.placed = 0;
    }

    tileClicked = (tile: Tile): void => {
        if (tile.value < 0){
            this.placeTile(tile);
            this.nextTurn();
        }
    }

    placeTile = (tile: Tile): void => {
        tile.value = this.turn;
        tile.element.classList.remove('empty');
        tile.element.classList.add(!this.turn ? 'black' : 'white');
        const {row, column} = tile;
        const paths: number[][][] = findPaths(this.grid.values(), this.turn, row, column);
        for (const path of paths){
            for (const [x, y] of path){
                this.grid.tiles[x][y].element.classList.add('path');
            }
        };
        this.gameOver = paths.length > 0;
        this.placed += 1;
    }

    nextTurn = (): void => {
        this.turn = (this.turn + 1) % 2;
    }

    restart = (): void => {
        this.turn = this.start;
        this.grid.tiles.forEach(row => row.forEach(tile => tile.reset()));
    }

}

class Header{
    restart: Restart

    constructor(restart: () => void){
        this.restart = new Restart(restart);
    }
}


class Restart{
    func: () => void

    constructor(func: () => void){
        this.func = func;
        document.getElementById('restart')?.addEventListener('click', _ => {
            func();
        });
    }
}


class Grid{
    rows: number
    columns: number
    element: HTMLDivElement
    tiles: Tile[][]

    constructor(rows: number, columns: number, tileClicked: (tile: Tile) => void){
        this.rows = rows;
        this.columns = columns;
        this.tiles = [...Array(this.rows)].map((_, i) => [...Array(this.columns)].map((_, j) => new Tile(i, j, tileClicked)));
        this.element = document.createElement('div');
        this.element.classList.add('grid');
        this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        this.element.append(...this.tiles.reduce((a, v) => a.concat([...v]), []).map(t => t.element));
        document.getElementById('game')?.appendChild(this.element);
    }

    values = (): number[][] => {
        return this.tiles.map(row => row.map(t => t.value));
    }
    
}

class Tile{
    row: number
    column: number
    value: number
    element: HTMLDivElement

    constructor(row: number, column: number, tileClicked: (tile: Tile) => void){
        this.row = row;
        this.column = column;
        this.value = -1;
        this.element = document.createElement('div');
        this.element.classList.add('empty');
        this.element.addEventListener('click', _ => {
            tileClicked(this);
        });
    }

    reset = (): void => {
        if (this.value > -1){
            this.element.className = "empty";
            this.value = -1;
        }
    }
}


const root = new Controller();