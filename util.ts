const inGrid = function(grid: number[][], i: number, j: number): boolean{
    return 0 <= i && i < grid.length && 0 <= j && j < grid[i].length;
}

export const findPaths = function(grid: number[][], turn: number, i: number, j: number): number[][][] {
    const out: number[][][] = [];
    const deltas: number[][] = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    for (const [dX, dY] of deltas){
        let p = [];
        for (let k = 0; k < 5; k++){
            const [x, y] = [i+(dX*k), j+(dY*k)]
            if (inGrid(grid, x, y) && grid[x][y] === turn){
                p.push([x, y]);
            } else {
                break;
            }
        };
        if (p.length === 5) out.push(p);

    }
    return out;
}