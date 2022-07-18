const findSequences = (indices: number[][], grid: number[][], turn: number): number[][][] => {
    let out: number[][][] = [],
        cur: number[][] = [];
    for (const [i, j] of indices){
        if (grid[i][j] === turn){
            cur.push([i, j]);
        } else {
            if (cur.length == 5) out.push(cur);
            cur = [];
        }
    }
    if (cur.length == 5) out.push(cur);
    return out;
}

const primaryDiagonal = (grid: number[][], i: number, j: number): number[][] => {
    const startX = i - Math.min(i, j);
    const startY = j - Math.min(i, j);
    const count = Math.min(grid.length - startX, grid.length - startY);
    return grid.slice(startX, startX + count).map((_, index) => [startX + index, startY + index]);
}

const secondaryDiagonal = (grid: number[][], i: number, j: number): number[][] => {
    const startX = i - Math.min(i, grid.length - j);
    const startY = j + Math.min(i, grid.length - j);
    const count = Math.min(grid.length - startX, startY + 1);
    return grid.slice(startX, startX + count).map((_, index) => [startX + index, startY - index]);
}

const findPaths = (grid: number[][], turn: number, i: number, j: number): number[][][] => {
    const horizontal = grid[i].map((_, index) => [i, index]);
    const vertical = grid.map((_, index) => [index, j]);
    const prim = primaryDiagonal(grid, i, j);
    const sec = secondaryDiagonal(grid, i, j);
    return [horizontal, vertical, prim, sec].map(group => findSequences(group, grid, turn)).flat();
}

enum STATUS {
    WHITE,
    BLACK,
    DRAW,
    RESTART,
    PLAY
};

class Controller{
    turn: number
    n: number
    game: Game | null;

    constructor(){
        this.turn = 0;
        this.n = 9;
        this.game = null;
        document.getElementById('switch')?.addEventListener('click', _ => {
            this.switchStartTurn();
        });

        const boardSizeInput = <HTMLInputElement>document.getElementById('boardSizeInput');
        boardSizeInput.value = String(this.n);
        boardSizeInput.addEventListener('input', e => {
            const inp = Number((e.target as HTMLInputElement).value);
            if (5 <= inp && inp <= 15) this.n = inp;
            boardSizeInput.value = String(this.n);
        });
        

        document.getElementById('startGame')?.addEventListener('click', _ => {
            this.startGame();
        });

        document.getElementById('restart')?.addEventListener('click', _ => {
            if (this.game) this.restart(this.game.status);
        });
    }

    switchStartTurn(){
        this.turn = (this.turn + 1) % 2;
        const element = document.getElementById('start');
        if (element) element.style.backgroundColor = !this.turn ? '#000000' : '#FFFFFF';
    }

    activateMenu(){
        const menu = <HTMLDivElement> document.getElementById('modal');
        menu.style.visibility = 'visible';
    }

    startGame(){
        if (5 <= this.n && this.n < 16){
            document.getElementById('grid')?.remove();
            this.game = new Game(this.turn, this.n, this);
            const modal = document.getElementById('modal');
            if (modal) modal.style.visibility = 'hidden';
            this.showHeader();
        }
    }

    showHeader(){
        const header = <HTMLDivElement> document.getElementById('header');
        header.style.visibility = 'visible';
    }

    hideHeader(){
        const header = <HTMLDivElement> document.getElementById('header');
        header.style.visibility = 'hidden';
    }

    restart = (status: STATUS): void => {
        const modal = document.getElementById('modal');
        if (modal) modal.style.visibility = 'visible';
        const white = document.getElementById('whiteTurn');
        const black = document.getElementById('blackTurn');
        if (white) white.style.visibility = 'hidden';
        if (black) black.style.visibility = 'hidden';
        clearInterval(this.game?.interval);
        this.game = null;
        this.switchStartTurn();
        this.hideHeader();
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
    placed: number
    controller: Controller
    status: STATUS
    player1Clock: Clock
    player2Clock: Clock
    interval: ReturnType<typeof setTimeout>;

    constructor(turn: number, n: number, controller: Controller){
        this.turn = turn;
        this.start = turn;
        this.header = new Header(() => this.restart());
        this.grid = new Grid(n, n, this.tileClicked);
        this.placed = 0;
        this.controller = controller;
        this.status = STATUS.PLAY;
        this.player1Clock = new Clock(30, 'p1clock');
        this.player2Clock = new Clock(30, 'p2clock');
        const t = document.getElementById(turn ? 'whiteTurn' : 'blackTurn');
        if (t) t.style.visibility = 'visible';
        this.interval = setInterval(this.tick, 1000);
    }

    tick = (): void => {
        const clock = this.turn ? this.player1Clock : this.player2Clock;
        if (this.status === STATUS.PLAY) clock.tick();
        if (!clock.seconds){
            this.status = this.turn ? STATUS.BLACK : STATUS.WHITE;
            this.controller.restart(this.status);
        }
    }

    tileClicked = (tile: Tile): void => {
        if (tile.value < 0 && this.status === STATUS.PLAY) this.placeTile(tile);
    }

    fillPath = (paths: number[][][]) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < paths[0].length){
                const [x, y] = paths[0][i++];
                this.grid.tiles[x][y].element.classList.add('path');
                
            } else {
                clearInterval(interval);
                return this.handlePlacement(paths)
            }
        }, 100);
    }

    placeTile = (tile: Tile): void => {
        tile.value = this.turn;
        tile.element.classList.remove('empty');
        tile.element.classList.add(!this.turn ? 'black' : 'white');
        const {row, column} = tile;
        const paths: number[][][] = findPaths(this.grid.values(), this.turn, row, column);
        this.placed += 1;
        if (paths.length){
            this.fillPath(paths);
        } else {
            this.handlePlacement(paths);
        }
    }

    handlePlacement = (paths: number[][][]): void => {
        if (paths.length > 0){
            this.status = !this.turn ? STATUS.BLACK : STATUS.WHITE;
        } else if (this.placed == this.grid.rows * this.grid.columns){
            this.status = STATUS.DRAW;
            return this.controller.restart(this.status);
        };

        if (this.status === STATUS.PLAY) this.nextTurn();
    }

    nextTurn = (): void => {
        this.turn = (this.turn + 1) % 2;
        const white = document.getElementById('whiteTurn');
        const black = document.getElementById('blackTurn');
        if (this.turn){
            if (white) white.style.visibility = 'visible';
            if (black) black.style.visibility = 'hidden';
        } else{
            if (white) white.style.visibility = 'hidden';
            if (black) black.style.visibility = 'visible';
        }
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

class Clock{
    seconds: number
    id: string

    constructor(seconds: number, id: string){
        this.seconds = seconds;
        this.id = id;
        this.setClock();
    }

    format(): string{
        const minutes = String(Math.floor(this.seconds / 60)).padStart(2, '0');;
        const seconds = String(this.seconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    tick = (): void => {
        this.seconds = Math.max(0, this.seconds - 1);
        this.setClock();
    }

    setClock = (): void => {
        const clock = document.getElementById(this.id);
        if (clock) clock.textContent = this.format();
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