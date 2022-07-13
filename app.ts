import {findPaths} from './util';


class Controller{
    turn: number
    game: Game

    constructor(){
        this.turn = 0;
        this.game = new Game(this.turn, 10, 10);
    }
}


class Game{
    turn: number
    start: number
    header: Header
    grid: Grid
    placedTileCount: number

    constructor(turn: number, rows: number, columns: number){
        this.turn = turn;
        this.start = turn;
        this.header = new Header(this.turn, () => this.restart());
        this.grid = new Grid(rows, columns, this.tileClicked);
        this.placedTileCount = 0;
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
        const pv: number[][][][] = findPaths(this.grid.values(), this.turn, row, column);
        for (const p of pv){
            for (const path of p){
                for (const [x, y] of path){
                    this.grid.tiles[x][y].element.classList.add('path');
                }
            }
        }
    }

    nextTurn = (): void => {
        this.turn = (this.turn + 1) % 2;
        this.header.turn.element.textContent = !this.turn ? 'Black' : 'White';
    }

    restart = (): void => {
        this.turn = this.start;
        this.grid.tiles.forEach(row => row.forEach(tile => tile.reset()));
        this.header.turn.element.textContent = !this.turn ? 'Black' : 'White';
    }

}

class Header{
    turn: PlayerTurn
    restart: HeaderItem

    constructor(turn: number, restart: () => void){
        this.turn = new PlayerTurn(!turn ? 'Black' : 'White');
        this.restart = new HeaderItem('Restart', restart);
    }
}

class PlayerTurn{
    element: HTMLSpanElement

    constructor(text: string){
        this.element = document.createElement('span');
        this.element.textContent = text;
        document.getElementById('header')?.appendChild(this.element);
    }
}

class HeaderItem{
    text: string
    func: () => void
    element: HTMLSpanElement

    constructor(text: string, func: () => void){
        this.text = text;
        this.func = func;
        this.element = document.createElement('span');
        this.element.classList.add('headerItem');
        this.element.textContent = text;
        document.getElementById('header')?.appendChild(this.element);
        this.element.addEventListener('click', _ => {
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
            this.element.classList.remove(!this.value ? 'black' : 'white')
            this.element.classList.add('empty');
            this.value = -1;
        }
    }
}


const root = new Controller();