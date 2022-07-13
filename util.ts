const findSequences = function(indices: number[][], grid: number[][], turn: number): number[][][]{
    let out: number[][][] = [],
        cur: number[][] = [];
    for (const [i, j] of indices){
        if (grid[i][j] === turn){
            cur.push([i, j]);
        } else {
            if (cur.length >= 5) out.push(cur);
            cur = [];
        }
    }
    if (cur.length >= 5) out.push(cur);
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

export const findPaths = function(grid: number[][], turn: number, i: number, j: number): number[][][][] {
    const horizontal = grid[i].map((_, index) => [i, index]);
    const vertical = grid.map((_, index) => [index, j]);
    const prim = primaryDiagonal(grid, i, j);
    const sec = secondaryDiagonal(grid, i, j);
    const groups = [horizontal, vertical, prim, sec];
    const paths = groups.map((group, index) => {
        const seq = findSequences(group, grid, turn);
        if (index===1) console.log(seq);
        return seq;
        }
    )
    return paths;
}