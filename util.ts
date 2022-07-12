
const inGrid = function(grid: number[][], i: number, j: number): boolean{
    return 0 <= i && i < grid.length && 0 <= j && j < grid[i].length;
}

const findSequences = function(arr: number[], turn: number): number[][]{
    let out: number[][] = [],
        cur = [];
    for (let i = 0; i < arr.length - 4; i++){
        if (arr[i] === turn){
            cur.push(i);
        } else {
            if (cur.length >= 5) out.push(cur);
            cur = [];
        }
    }
    return out;
}

const primaryDiagonal = function(grid: number[][], i: number, j: number): number[][]{
    const startX = i - Math.min(i, j);
    const startY = j - Math.min(i, j);
    const count = Math.min(grid.length - startX, grid.length - startY);
    return grid.slice(startX, startX + count).map((_, index) => [startX + index, startY + index]);
}

const secondaryDiagonal = function(grid: number[][], i: number, j: number): number[][]{
    const startX = i - Math.min(i, grid.length - j);
    const startY = j + Math.min(i, grid.length - j);
    const count = Math.min(grid.length - startX, startY + 1);
    return grid.slice(startX, startX + count).map((_, index) => [startX + index, startY - index]);
}

export const findPaths = function(grid: number[][], turn: number, i: number, j: number): number[][][] {
    const out: number[][][] = [];
    const horizontal = findSequences(grid[i], turn);
    const vertical = findSequences(grid.map(row => row[j]), turn);
    const prim = primaryDiagonal(grid, i, j);
    const sec = secondaryDiagonal(grid, i, j);
    console.log(sec);
    return out;
}