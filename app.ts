import { throws } from 'assert';
import path from 'path';
import {findPaths} from './util';


enum STATUS {
    WHITE,
    BLACK,
    DRAW,
    RESTART,
    PLAY
};

class Controller{
    playing: boolean
    turn: number
    n: number
    game: Game | null;

    constructor(){
        this.playing = false
        this.turn = 0;
        this.n = 15;
        this.game = null;
        document.getElementById('switch')?.addEventListener('click', _ => {
            this.turn = (this.turn + 1) % 2;
            const element = document.getElementById('start');
            if (element) element.style.backgroundColor = !this.turn ? '#000000' : '#FFFFFF';
        });

        document.getElementById('boardSizeInput')?.addEventListener('input', e => {
            const t = (e.target as HTMLTextAreaElement).value;
            if (/^\d+$/.test(t)) this.n = Math.min(15, Number(t));
        })

        document.getElementById('startGame')?.addEventListener('click', _ => {
            this.startGame();
        });

        document.getElementById('restart')?.addEventListener('click', _ => {
            this.restart(STATUS.RESTART);
        });
    }

    activateMenu(){
        const menu = document.getElementById('modal');
        if (menu) menu.style.visibility = 'visible';
    }

    startGame(){
        if (0 <= this.n && this.n < 16){
            document.getElementById('grid')?.remove();
            this.game = new Game(this.turn, this.n, this.n, this);
            const modal = document.getElementById('modal');
            if (modal) modal.style.visibility = 'hidden';
            this.showHeader();
        }
    }

    showHeader(){
        const header = document.getElementById('header');
        if (header) header.style.visibility = 'visible';
    }

    hideHeader(){
        const header = document.getElementById('header');
        if (header) header.style.visibility = 'hidden';
    }

    restart = (status: STATUS): void => {
        const modal = document.getElementById('modal');
        if (modal) modal.style.visibility = 'visible';
        this.game = null;
        this.hideHeader()
        const modalHeader = document.getElementById('modalHeader');
        if (modalHeader){
            modalHeader.textContent = status == STATUS.WHITE ? 'White wins' 
            : status == STATUS.BLACK ? 'Black wins' 
            : status == STATUS.DRAW ? 'Draw'
            : 'New game';
        }
    }
}


class Game{
    turn: number
    start: number
    header: Header
    grid: Grid
    gameOver: boolean
    placed: number
    controller: Controller
    status: STATUS

    constructor(turn: number, rows: number, columns: number, controller: Controller){
        this.turn = turn;
        this.start = turn;
        this.header = new Header(() => this.restart());
        this.grid = new Grid(rows, columns, this.tileClicked);
        this.gameOver = false;
        this.placed = 0;
        this.controller = controller;
        this.status = STATUS.PLAY;
    }

    tileClicked = (tile: Tile): void => {

        if (tile.value < 0 && this.status === STATUS.PLAY){
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
        this.placed += 1;
        if (paths.length > 0){
            this.gameOver = true;
            this.status = !this.turn ? STATUS.BLACK : STATUS.WHITE;
        } else if (this.placed == this.grid.rows * this.grid.columns){
            this.gameOver = true;
            this.status = STATUS.DRAW;
        };
        if (this.gameOver) this.controller.restart(this.status);
    }

    nextTurn = (): void => {
        this.turn = (this.turn + 1) % 2;
    }

    restart = (): void => {
        this.turn = this.start;
        this.grid.tiles.forEach(row => row.forEach(tile => tile.reset()));
    }

    endGame = (): void => {
        const modal = document.getElementById('modal');
        if (modal) modal.style.visibility = 'visible';
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
        this.element.id = 'grid';
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