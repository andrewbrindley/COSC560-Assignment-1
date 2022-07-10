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
var Controller = /** @class */ (function () {
    function Controller() {
        this.turn = 0;
        this.header = new Header(this.turn);
        this.game = new Game(this.turn, 15, 15);
    }
    return Controller;
}());
var Header = /** @class */ (function () {
    function Header(turn) {
        this.turn = new PlayerTurn(turn);
    }
    return Header;
}());
var PlayerTurn = /** @class */ (function () {
    function PlayerTurn(turn) {
        var _a;
        this.turn = turn;
        this.element = document.createElement('span');
        this.element.id = 'player';
        this.element.textContent = "Hello";
        (_a = document.getElementById('header')) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);
    }
    return PlayerTurn;
}());
var Game = /** @class */ (function () {
    function Game(turn, rows, columns) {
        var _this = this;
        this.tileClicked = function (tile) {
            if (tile.value < 0) {
                _this.placeTile(tile);
                _this.nextTurn();
            }
        };
        this.placeTile = function (tile) {
            tile.value = _this.turn;
            tile.element.classList.remove('empty');
            tile.element.classList.add(!_this.turn ? 'black' : 'white');
        };
        this.nextTurn = function () {
            _this.turn = (_this.turn + 1) % 2;
        };
        this.turn = turn;
        this.grid = new Grid(rows, columns, this.tileClicked);
    }
    return Game;
}());
var Grid = /** @class */ (function () {
    function Grid(rows, columns, tileClicked) {
        var _a;
        var _this = this;
        var _b;
        this.rows = rows;
        this.columns = columns;
        this.tiles = __spreadArray([], Array(this.rows), true).map(function (_, i) { return __spreadArray([], Array(_this.columns), true).map(function (_, j) { return new Tile(i, j, tileClicked); }); });
        this.element = document.createElement('div');
        this.element.classList.add('grid');
        this.element.style.gridTemplateRows = "repeat(".concat(this.rows, ", 1fr)");
        this.element.style.gridTemplateColumns = "repeat(".concat(this.columns, ", 1fr)");
        (_a = this.element).append.apply(_a, this.tiles.reduce(function (a, v) { return a.concat(__spreadArray([], v, true)); }, []).map(function (t) { return t.element; }));
        (_b = document.getElementById('game')) === null || _b === void 0 ? void 0 : _b.appendChild(this.element);
    }
    return Grid;
}());
var Tile = /** @class */ (function () {
    function Tile(row, column, tileClicked) {
        var _this = this;
        this.row = row;
        this.column = column;
        this.value = -1;
        this.element = document.createElement('div');
        this.element.classList.add('empty');
        this.element.addEventListener('click', function (_) {
            tileClicked(_this);
        });
    }
    return Tile;
}());
var root = new Controller();
