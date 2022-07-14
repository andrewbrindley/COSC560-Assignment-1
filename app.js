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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        var _a, _b, _c;
        this.playing = false;
        this.turn = 0;
        this.n = -1;
        this.game = null;
        (_a = document.getElementById('switch')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (_) {
            _this.turn = (_this.turn + 1) % 2;
            var element = document.getElementById('start');
            if (element)
                element.style.backgroundColor = !_this.turn ? '#000000' : '#FFFFFF';
        });
        (_b = document.getElementById('boardSizeInput')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function (e) {
            var t = e.target.value;
            if (/^\d+$/.test(t))
                _this.n = Math.max(15, Number(t));
        });
        (_c = document.getElementById('startGame')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (_) {
            _this.startGame();
        });
    }
    Controller.prototype.activateMenu = function () {
        var menu = document.getElementById('modal');
        if (menu)
            menu.style.visibility = 'visible';
    };
    Controller.prototype.startGame = function () {
        if (0 <= this.n && this.n < 16) {
            this.game = new Game(this.turn, this.n, this.n);
            var modal = document.getElementById('modal');
            if (modal)
                modal.style.visibility = 'hidden';
        }
    };
    return Controller;
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
            var row = tile.row, column = tile.column;
            var paths = (0, util_1.findPaths)(_this.grid.values(), _this.turn, row, column);
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                for (var _a = 0, path_1 = path; _a < path_1.length; _a++) {
                    var _b = path_1[_a], x = _b[0], y = _b[1];
                    _this.grid.tiles[x][y].element.classList.add('path');
                }
            }
            ;
            _this.gameOver = paths.length > 0;
            _this.placed += 1;
        };
        this.nextTurn = function () {
            _this.turn = (_this.turn + 1) % 2;
        };
        this.restart = function () {
            _this.turn = _this.start;
            _this.grid.tiles.forEach(function (row) { return row.forEach(function (tile) { return tile.reset(); }); });
        };
        this.turn = turn;
        this.start = turn;
        this.header = new Header(function () { return _this.restart(); });
        this.grid = new Grid(rows, columns, this.tileClicked);
        this.gameOver = false;
        this.placed = 0;
    }
    return Game;
}());
var Header = /** @class */ (function () {
    function Header(restart) {
        this.restart = new Restart(restart);
    }
    return Header;
}());
var Restart = /** @class */ (function () {
    function Restart(func) {
        var _a;
        this.func = func;
        (_a = document.getElementById('restart')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (_) {
            func();
        });
    }
    return Restart;
}());
var Grid = /** @class */ (function () {
    function Grid(rows, columns, tileClicked) {
        var _a;
        var _this = this;
        var _b;
        this.values = function () {
            return _this.tiles.map(function (row) { return row.map(function (t) { return t.value; }); });
        };
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
        this.reset = function () {
            if (_this.value > -1) {
                _this.element.className = "empty";
                _this.value = -1;
            }
        };
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
