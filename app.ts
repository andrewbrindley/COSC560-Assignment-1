class Controller{
    turn: number
    game: Game

    constructor(){
        this.turn = 0;
        this.game = new Game(this.turn, 15, 15);
    }
}

class Game{
    turn: number
    grid: Grid

    constructor(turn: number, rows: number, columns: number){
        this.turn = turn;
        this.grid = new Grid(rows, columns, this.tileClicked);
    }

    tileClicked = (tile: Tile): void => {
        if (tile.value < 0){
            tile.value = this.turn;
            tile.element.classList.remove('empty');
            tile.element.classList.add(!this.turn ? 'black' : 'white');
            this.turn = (this.turn + 1) % 2;
        }
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
}


const root = new Game(0, 15, 15);