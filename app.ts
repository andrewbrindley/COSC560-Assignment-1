class Controller{

}

class Tile{
    row: number
    column: number
    element: HTMLDivElement

    constructor(row: number, column: number){
        this.row = row;
        this.column = column;
        this.element = document.createElement('div');
        this.element.classList.add('tile');
        this.element.addEventListener("click", function(e) {
            console.log(row, column)
        }, false);
    }
}

class Grid{
    rows: number
    columns: number
    element: HTMLDivElement
    tiles: Tile[][]
    flatTiles: Tile[]

    constructor(rows: number, columns: number){
        this.rows = rows;
        this.columns = columns;
        this.tiles = [...Array(this.rows)].map((_, i) => [...Array(this.columns)].map((_, j) => new Tile(i, j)));
        this.flatTiles = this.tiles.reduce((a, v) => a.concat([...v]), []);
        this.element = document.createElement('div');
        this.element.classList.add('grid');
        this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.element.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
        this.element.append(...this.flatTiles.map(t => t.element));
    }
}

const myGrid = new Grid(15, 15);
document.getElementById('game')?.appendChild(myGrid.element);