"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaths = void 0;
var findSequences = function (indices, grid, turn) {
    var out = [], cur = [];
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var _a = indices_1[_i], i = _a[0], j = _a[1];
        if (grid[i][j] === turn) {
            cur.push([i, j]);
        }
        else {
            if (cur.length >= 5)
                out.push(cur);
            cur = [];
        }
    }
    if (cur.length >= 5)
        out.push(cur);
    return out;
};
var primaryDiagonal = function (grid, i, j) {
    var startX = i - Math.min(i, j);
    var startY = j - Math.min(i, j);
    var count = Math.min(grid.length - startX, grid.length - startY);
    return grid.slice(startX, startX + count).map(function (_, index) { return [startX + index, startY + index]; });
};
var secondaryDiagonal = function (grid, i, j) {
    var startX = i - Math.min(i, grid.length - j);
    var startY = j + Math.min(i, grid.length - j);
    var count = Math.min(grid.length - startX, startY + 1);
    return grid.slice(startX, startX + count).map(function (_, index) { return [startX + index, startY - index]; });
};
var findPaths = function (grid, turn, i, j) {
    var horizontal = grid[i].map(function (_, index) { return [i, index]; });
    var vertical = grid.map(function (_, index) { return [index, j]; });
    var prim = primaryDiagonal(grid, i, j);
    var sec = secondaryDiagonal(grid, i, j);
    return [horizontal, vertical, prim, sec].map(function (group) { return findSequences(group, grid, turn); }).flat();
};
exports.findPaths = findPaths;
