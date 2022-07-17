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
var findSequences = function (indices, grid, turn) {
    var out = [], cur = [];
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var _a = indices_1[_i], i = _a[0], j = _a[1];
        if (grid[i][j] === turn) {
            cur.push([i, j]);
        }
        else {
            if (cur.length == 5)
                out.push(cur);
            cur = [];
        }
    }
    if (cur.length == 5)
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
var STATUS;
(function (STATUS) {
    STATUS[STATUS["WHITE"] = 0] = "WHITE";
    STATUS[STATUS["BLACK"] = 1] = "BLACK";
    STATUS[STATUS["DRAW"] = 2] = "DRAW";
    STATUS[STATUS["RESTART"] = 3] = "RESTART";
    STATUS[STATUS["PLAY"] = 4] = "PLAY";
})(STATUS || (STATUS = {}));
;
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        var _a, _b, _c, _d;
        this.restart = function (status) {
            var _a;
            var modal = document.getElementById('modal');
            if (modal)
                modal.style.visibility = 'visible';
            var white = document.getElementById('whiteTurn');
            var black = document.getElementById('blackTurn');
            if (white)
                white.style.visibility = 'hidden';
            if (black)
                black.style.visibility = 'hidden';
            clearInterval((_a = _this.game) === null || _a === void 0 ? void 0 : _a.interval);
            _this.game = null;
            _this.switchStartTurn();
            _this.hideHeader();
            var modalHeader = document.getElementById('modalHeader');
            if (modalHeader) {
                modalHeader.textContent = status == STATUS.WHITE ? 'White wins'
                    : status == STATUS.BLACK ? 'Black wins'
                        : status == STATUS.DRAW ? 'Draw'
                            : 'New game';
            }
        };
        this.turn = 0;
        this.n = 15;
        this.game = null;
        (_a = document.getElementById('switch')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (_) {
            _this.switchStartTurn();
        });
        (_b = document.getElementById('boardSizeInput')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', function (e) {
            var t = e.target.value;
            if (/^\d+$/.test(t))
                _this.n = Math.max(5, Math.min(15, Number(t)));
        });
        (_c = document.getElementById('startGame')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (_) {
            _this.startGame();
        });
        (_d = document.getElementById('restart')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (_) {
            _this.restart(STATUS.RESTART);
        });
    }
    Controller.prototype.switchStartTurn = function () {
        this.turn = (this.turn + 1) % 2;
        var element = document.getElementById('start');
        if (element)
            element.style.backgroundColor = !this.turn ? '#000000' : '#FFFFFF';
    };
    Controller.prototype.activateMenu = function () {
        var menu = document.getElementById('modal');
        if (menu)
            menu.style.visibility = 'visible';
    };
    Controller.prototype.startGame = function () {
        var _a;
        if (5 <= this.n && this.n < 16) {
            (_a = document.getElementById('grid')) === null || _a === void 0 ? void 0 : _a.remove();
            this.game = new Game(this.turn, this.n, this.n, this);
            var modal = document.getElementById('modal');
            if (modal)
                modal.style.visibility = 'hidden';
            this.showHeader();
        }
    };
    Controller.prototype.showHeader = function () {
        var header = document.getElementById('header');
        if (header)
            header.style.visibility = 'visible';
    };
    Controller.prototype.hideHeader = function () {
        var header = document.getElementById('header');
        if (header)
            header.style.visibility = 'hidden';
    };
    return Controller;
}());
var Game = /** @class */ (function () {
    function Game(turn, rows, columns, controller) {
        var _this = this;
        this.tick = function () {
            var clock = _this.turn ? _this.player1Clock : _this.player2Clock;
            clock.tick();
            if (!clock.seconds) {
                _this.status = _this.turn ? STATUS.BLACK : STATUS.WHITE;
                _this.controller.restart(_this.status);
            }
        };
        this.tileClicked = function (tile) {
            if (tile.value < 0 && _this.status === STATUS.PLAY)
                _this.placeTile(tile);
        };
        this.placeTile = function (tile) {
            tile.value = _this.turn;
            tile.element.classList.remove('empty');
            tile.element.classList.add(!_this.turn ? 'black' : 'white');
            var row = tile.row, column = tile.column;
            var paths = findPaths(_this.grid.values(), _this.turn, row, column);
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                for (var _a = 0, path_1 = path; _a < path_1.length; _a++) {
                    var _b = path_1[_a], x = _b[0], y = _b[1];
                    _this.grid.tiles[x][y].element.classList.add('path');
                }
            }
            ;
            _this.placed += 1;
            if (paths.length > 0) {
                _this.gameOver = true;
                _this.status = !_this.turn ? STATUS.BLACK : STATUS.WHITE;
            }
            else if (_this.placed == _this.grid.rows * _this.grid.columns) {
                _this.gameOver = true;
                _this.status = STATUS.DRAW;
            }
            ;
            if (_this.gameOver) {
                _this.controller.restart(_this.status);
            }
            else {
                _this.nextTurn();
            }
        };
        this.nextTurn = function () {
            _this.turn = (_this.turn + 1) % 2;
            var white = document.getElementById('whiteTurn');
            var black = document.getElementById('blackTurn');
            if (_this.turn) {
                if (white)
                    white.style.visibility = 'visible';
                if (black)
                    black.style.visibility = 'hidden';
            }
            else {
                if (white)
                    white.style.visibility = 'hidden';
                if (black)
                    black.style.visibility = 'visible';
            }
        };
        this.restart = function () {
            _this.turn = _this.start;
            _this.grid.tiles.forEach(function (row) { return row.forEach(function (tile) { return tile.reset(); }); });
        };
        this.endGame = function () {
            var modal = document.getElementById('modal');
            if (modal)
                modal.style.visibility = 'visible';
        };
        this.turn = turn;
        this.start = turn;
        this.header = new Header(function () { return _this.restart(); });
        this.grid = new Grid(rows, columns, this.tileClicked);
        this.gameOver = false;
        this.placed = 0;
        this.controller = controller;
        this.status = STATUS.PLAY;
        this.player1Clock = new Clock(30, 'p1clock');
        this.player2Clock = new Clock(30, 'p2clock');
        var t = document.getElementById(turn ? 'whiteTurn' : 'blackTurn');
        if (t)
            t.style.visibility = 'visible';
        this.interval = setInterval(this.tick, 1000);
    }
    return Game;
}());
var Clock = /** @class */ (function () {
    function Clock(seconds, id) {
        var _this = this;
        this.tick = function () {
            _this.seconds = Math.max(0, _this.seconds - 1);
            _this.setClock();
        };
        this.setClock = function () {
            var clock = document.getElementById(_this.id);
            if (clock)
                clock.textContent = _this.format();
        };
        this.seconds = seconds;
        this.id = id;
        this.setClock();
    }
    Clock.prototype.format = function () {
        var minutes = String(Math.floor(this.seconds / 60)).padStart(2, '0');
        ;
        var seconds = String(this.seconds % 60).padStart(2, '0');
        return "".concat(minutes, ":").concat(seconds);
    };
    return Clock;
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
        this.element.id = 'grid';
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
