"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaths = void 0;
var inGrid = function (grid, i, j) {
    return 0 <= i && i < grid.length && 0 <= j && j < grid[i].length;
};
var findPaths = function (grid, turn, i, j) {
    var out = [];
    var deltas = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    for (var _i = 0, deltas_1 = deltas; _i < deltas_1.length; _i++) {
        var _a = deltas_1[_i], dX = _a[0], dY = _a[1];
        var p = [];
        for (var k = 0; k < 5; k++) {
            var _b = [i + (dX * k), j + (dY * k)], x = _b[0], y = _b[1];
            if (inGrid(grid, x, y) && grid[x][y] === turn) {
                p.push([x, y]);
            }
            else {
                break;
            }
        }
        ;
        if (p.length === 5)
            out.push(p);
    }
    return out;
};
exports.findPaths = findPaths;
