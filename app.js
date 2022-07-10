"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
var Controller = /** @class */ (function () {
    function Controller() {
    }
    return Controller;
}());
var Tile = /** @class */ (function () {
    function Tile(row, column) {
        this.row = row;
        this.column = column;
        this.element = document.createElement('div');
        this.element.classList.add('tile');
        this.element.addEventListener("click", function (e) {
            console.log(row, column);
        }, false);
    }
    return Tile;
}());
var Grid = /** @class */ (function () {
    function Grid(rows, columns) {
        var _a;
        var _this = this;
        this.rows = rows;
        this.columns = columns;
        this.tiles = __spreadArray([], Array(this.rows), true).map(function (_, i) { return __spreadArray([], Array(_this.columns), true).map(function (_, j) { return new Tile(i, j); }); });
        this.flatTiles = this.tiles.reduce(function (a, v) { return a.concat(__spreadArray([], v, true)); }, []);
        this.element = document.createElement('div');
        this.element.classList.add('grid');
        this.element.style.gridTemplateRows = "repeat(".concat(this.rows, ", 1fr)");
        this.element.style.gridTemplateColumns = "repeat(".concat(this.columns, ", 1fr)");
        (_a = this.element).append.apply(_a, this.flatTiles.map(function (t) { return t.element; }));
    }
    return Grid;
}());
var myGrid = new Grid(15, 15);
(_a = document.getElementById('game')) === null || _a === void 0 ? void 0 : _a.appendChild(myGrid.element);
