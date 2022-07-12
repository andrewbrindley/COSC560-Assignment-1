"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaths = void 0;
var inGrid = function (grid, i, j) {
    return 0 <= i && i < grid.length && 0 <= j && j < grid[i].length;
};
var findSequences = function (arr, turn) {
    var out = [], cur = [];
    for (var i = 0; i < arr.length - 4; i++) {
        if (arr[i] === turn) {
            cur.push(i);
        }
        else {
            if (cur.length >= 5)
                out.push(cur);
            cur = [];
        }
    }
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
    var out = [];
    var horizontal = findSequences(grid[i], turn);
    var vertical = findSequences(grid.map(function (row) { return row[j]; }), turn);
    var prim = primaryDiagonal(grid, i, j);
    var sec = secondaryDiagonal(grid, i, j);
    console.log(sec);
    return out;
};
exports.findPaths = findPaths;
