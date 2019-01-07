const hash = require("object-hash");

export const PieceType = {
  BLOCK: 0,
  V2: 1,
  H2: 2,
  CUBE: 3,
  EMPTY: 4,
  BOARDER: 5
};

function printPiece(type) {
  switch (type) {
    case PieceType.BLOCK:
      return "BL";
    case PieceType.V2:
      return "V2";
    case PieceType.H2:
      return "H2";
    case PieceType.CUBE:
      return "CB";
    case PieceType.EMPTY:
      return "O ";
    case PieceType.BOARDER:
      return "X ";
    default:
      return "! ";
  }
}
const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 5;

class Position {
  constructor(left, top) {
    this.left = left;
    this.top = top;
  }

  copy() {
    return new Position(this.left, this.top);
  }

  moveTo(direction) {
    switch (direction) {
      case DIRECTIONS.LEFT:
        return this.moveLeft();
      case DIRECTIONS.RIGHT:
        return this.moveRight();
      case DIRECTIONS.UP:
        return this.moveUp();
      case DIRECTIONS.DOWN:
        return this.moveDown();
      default:
        throw new Error(`Unknown direction to move to: ${direction}`);
    }
  }

  equals(position) {
    return this.left === position.left && this.top === position.top;
  }

  moveLeft() {
    this.left--;
    return this;
  }

  moveRight() {
    this.left++;
    return this;
  }

  moveUp() {
    this.top--;
    return this;
  }

  moveDown() {
    this.top++;
    return this;
  }

  lessThan(position) {
    if (this.top < position.top) return true;
    else if (this.top > position.top) return false;
    else {
      return this.left < position.left;
    }
  }
}

function generateZobrisHashMap(width, height, pieceTypes) {
  const rslt = [];
  for (let i = 0; i < height; i++) {
    rslt.push([]);
    for (let j = 0; j < width; j++) {
      rslt[i].push([]);
      for (let k = 0; k < Object.keys(pieceTypes).length; k++) {
        let tmp = 0;
        while (!tmp) {
          tmp = Math.floor(Math.random() * Math.pow(2, 31));
        }
        rslt[i][j].push(tmp);
      }
    }
  }
  return rslt;
}

const zobristHash = generateZobrisHashMap(BOARD_WIDTH, BOARD_HEIGHT, PieceType);

class Piece {
  constructor(type, position, id, name) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.position = position;
  }

  moveTo(direction) {
    this.position.moveTo(direction);
  }

  copy() {
    const pieceCopy = new Piece(
      this.type,
      this.position.copy(),
      this.id,
      this.name
    );
    return pieceCopy;
  }

  copyDumbPiece() {
    return new Piece(this.type, this.position.copy());
  }

  copyMirrorDumbPiece(width) {
    const newPosition = this.position.copy();
    if (this.type === PieceType.H2 || this.type === PieceType.CUBE) {
      newPosition.left = width - 2 - newPosition.left;
    } else {
      newPosition.left = width - 1 - newPosition.left;
    }
    return new Piece(this.type, newPosition);
  }

  canBeReplacedBy(piece) {
    return this.isEmpty() || this.equals(piece);
  }

  isEmpty() {
    return this.type === PieceType.EMPTY;
  }

  equals(piece) {
    return this.id && this.id === piece.id;
  }

  lessThan(piece) {
    if (this.type < piece.type) return true;
    else if (this.type > piece.type) return false;
    else {
      return this.position.lessThan(piece.position);
    }
  }
}

export const gamePositions = [
  [
    new Piece(PieceType.V2, new Position(0, 0), 0, "zf"),
    new Piece(PieceType.CUBE, new Position(1, 0), 1, "cc"),
    new Piece(PieceType.V2, new Position(3, 0), 2, "mc"),
    new Piece(PieceType.V2, new Position(0, 2), 3, "zy"),
    new Piece(PieceType.H2, new Position(1, 2), 4, "gy"),
    new Piece(PieceType.V2, new Position(3, 2), 5, "hz"),
    new Piece(PieceType.BLOCK, new Position(0, 4), 6, "b"),
    new Piece(PieceType.BLOCK, new Position(1, 3), 7, "b"),
    new Piece(PieceType.BLOCK, new Position(2, 3), 8, "b"),
    new Piece(PieceType.BLOCK, new Position(3, 4), 9, "b")
  ],
  [
    new Piece(PieceType.V2, new Position(0, 0), 0, "zf"),
    new Piece(PieceType.CUBE, new Position(1, 0), 1, "cc"),
    new Piece(PieceType.V2, new Position(3, 0), 2, "gy"),
    new Piece(PieceType.BLOCK, new Position(0, 2), 3, "b"),
    new Piece(PieceType.H2, new Position(1, 2), 4, "zy"),
    new Piece(PieceType.BLOCK, new Position(3, 2), 5, "b"),
    new Piece(PieceType.V2, new Position(0, 3), 6, "hz"),
    new Piece(PieceType.BLOCK, new Position(1, 3), 7, "b"),
    new Piece(PieceType.BLOCK, new Position(2, 3), 8, "b"),
    new Piece(PieceType.V2, new Position(3, 3), 9, "mc")
  ],
  [
    new Piece(PieceType.BLOCK, new Position(0, 0), 0, "b"),
    new Piece(PieceType.CUBE, new Position(1, 0), 1, "cc"),
    new Piece(PieceType.BLOCK, new Position(3, 0), 2, "b"),
    new Piece(PieceType.V2, new Position(0, 1), 3, "zf"),
    new Piece(PieceType.H2, new Position(1, 2), 4, "zy"),
    new Piece(PieceType.V2, new Position(3, 1), 5, "gy"),
    new Piece(PieceType.V2, new Position(0, 3), 6, "hz"),
    new Piece(PieceType.BLOCK, new Position(1, 3), 7, "b"),
    new Piece(PieceType.BLOCK, new Position(2, 3), 8, "b"),
    new Piece(PieceType.V2, new Position(3, 3), 9, "mc")
  ]
];

const successTop = 3;
const successLeft = 1;
const successPosition = new Position(successLeft, successTop);

const HASH_METHOD = "ZOBRIST";

class Board {
  constructor() {
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.piecesPlaced = false;
    this.initBoard();
  }

  initBoard() {
    const board = [];
    for (let i = 0; i < this.height + 2; i++) {
      board.push([]);
      for (let j = 0; j < this.width + 2; j++) {
        const position = new Position(i, j);
        let piece = null;
        if (
          i === 0 ||
          j === 0 ||
          i === this.height + 1 ||
          j === this.width + 1
        ) {
          piece = new Piece(PieceType.BOARDER, position);
        } else {
          piece = new Piece(PieceType.EMPTY, position);
        }
        board[i][j] = piece;
      }
    }
    this.board = board;
    return board;
  }

  initPieces(pieces, cubeIndex) {
    if (!Array.isArray(pieces)) {
      throw new Error("pieces should be an array!");
    }
    this.pieces = pieces;
    this.cubeIndex = cubeIndex;
    this.cube = this.pieces[cubeIndex];
    pieces.forEach((p, i) => {
      if (!this.canAddPieceToBoard(p)) {
        const msg = `Piece of index ${i} could not be put on board`;
        console.log(msg);
        throw new Error(msg);
      }
      this.addPieceToBoard(p);
    });
    this.piecesPlaced = true;
  }

  equals(board) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const p1 = this.getPiece(new Position(j, i));
        const p2 = board.getPiece(new Position(j, i));
        if (p1.type !== p2.type) {
          this.printBoard();
          board.printBoard();
          return false;
        }
      }
    }
    return true;
  }

  getPiece(position) {
    return this.board[position.top + 1][position.left + 1];
  }

  isResolved() {
    return this.cube.position.equals(successPosition);
  }

  canAddPieceToBoard(piece, targetPosition) {
    let position = targetPosition || piece.position;
    position = position.copy();
    const topLeftPiece = this.getPiece(position);
    let rslt = topLeftPiece.canBeReplacedBy(piece);
    if (!rslt) {
      return false;
    }

    const rightPiece = this.getPiece(position.moveRight());
    const diagPiece = this.getPiece(position.moveDown());
    const downPiece = this.getPiece(position.moveLeft());
    switch (piece.type) {
      case PieceType.BLOCK:
        return rslt;
      case PieceType.H2:
        return rightPiece.canBeReplacedBy(piece);
      case PieceType.V2:
        return downPiece.canBeReplacedBy(piece);
      case PieceType.CUBE:
        return (
          rightPiece.canBeReplacedBy(piece) &&
          downPiece.canBeReplacedBy(piece) &&
          diagPiece.canBeReplacedBy(piece)
        );
      default:
        return false;
    }
  }

  addPieceToBoard(piece) {
    const { left, top } = piece.position;
    switch (piece.type) {
      case PieceType.BLOCK:
        this.board[top + 1][left + 1] = piece;
        break;
      case PieceType.H2:
        this.board[top + 1][left + 1] = piece;
        this.board[top + 1][left + 2] = piece;
        break;
      case PieceType.V2:
        this.board[top + 1][left + 1] = piece;
        this.board[top + 2][left + 1] = piece;
        break;
      case PieceType.CUBE:
        this.board[top + 1][left + 1] = piece;
        this.board[top + 1][left + 2] = piece;
        this.board[top + 2][left + 2] = piece;
        this.board[top + 2][left + 1] = piece;
        break;
      default:
        return false;
    }
    return true;
  }

  canPieceMoveTo(pieceIndex, direction) {
    const piece = this.pieces[pieceIndex];
    return this.canAddPieceToBoard(
      piece,
      piece.position.copy().moveTo(direction)
    );
  }

  clearRectangle(fromPosition, toPosition) {
    for (let i = fromPosition.top; i <= toPosition.top; i++) {
      for (let j = fromPosition.left; j <= toPosition.left; j++) {
        this.board[i + 1][j + 1] = new Piece(
          PieceType.EMPTY,
          new Position(j, i)
        );
      }
    }
  }

  clearPiece(piece) {
    const { position } = piece;
    switch (piece.type) {
      case PieceType.BLOCK:
        this.clearRectangle(position, position);
        break;
      case PieceType.V2:
        this.clearRectangle(position, position.copy().moveDown());
        break;
      case PieceType.H2:
        this.clearRectangle(position, position.copy().moveRight());
        break;
      case PieceType.CUBE:
        this.clearRectangle(
          position,
          position
            .copy()
            .moveRight()
            .moveDown()
        );
        break;
      default:
        throw new Error(`Unknow piece type: ${piece.type}`);
    }
  }

  movePieceTo(pieceIndex, direction) {
    const piece = this.pieces[pieceIndex];
    this.clearPiece(piece);
    piece.moveTo(direction);
    this.addPieceToBoard(piece);
    return true;
  }

  getZobristHash() {
    let hash = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        hash ^= zobristHash[i][j][this.board[i + 1][j + 1].type];
      }
    }
    return hash;
  }

  getMirrorZobristHash() {
    let hash = 0;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        hash ^=
          zobristHash[i][j][
            this.getPiece(new Position(j, i)).copyMirrorDumbPiece().type
          ];
      }
    }
    return hash;
  }

  getPieceHash() {
    const dumbPieces = this.pieces.map(p => p.copyDumbPiece());
    return hash(dumbPieces.sort((a, b) => a.lessThan(b)));
  }

  getMirrorPieceHash() {
    const mirrorDumbPieces = this.pieces.map(p =>
      p.copyMirrorDumbPiece(this.width)
    );
    return hash(mirrorDumbPieces.sort((a, b) => a.lessThan(b)));
  }

  getHash() {
    if (this.hash) {
      return this.hash;
    }
    if (HASH_METHOD === "ZOBRIST") {
      this.hash = this.getZobristHash();
    } else {
      this.hash = this.getPieceHash();
    }
    return this.hash;
  }

  getMirrorHash() {
    if (this.mirrorHash) {
      return this.mirrorHash;
    }

    if (HASH_METHOD === "ZOBRIST") {
      this.mirrorHash = this.getMirrorZobristHash();
    } else {
      this.mirrorHash = this.getMirrorPieceHash();
    }
    return this.mirrorHash;
  }

  printBoard(useSymbol = true) {
    for (let i = 0; i < this.height + 2; i++) {
      let row = "";
      for (let j = 0; j < this.width + 2; j++) {
        row =
          row +
          (useSymbol
            ? printPiece(this.board[i][j].type)
            : this.board[i][j].id === undefined
            ? -1
            : this.board[i][j].id) +
          " ";
      }
      console.log(row);
    }
  }
}

class Move {
  constructor(pieceIndex, direction, length) {
    this.pieceIndex = pieceIndex;
    this.direction = direction;
    this.length = length;
  }
}

let hashTime = 0;

class GamePosition {
  constructor() {
    this.board = new Board();
    this.parent = null;
    this.step = 0;
    this.move = null;
  }

  getPieces() {
    return this.board.pieces;
  }

  getPiece(index) {
    return this.board.pieces[index];
  }

  isResolved() {
    return this.board.isResolved();
  }

  initPosition(pieces, cubeIndex) {
    this.cubeIndex = cubeIndex;
    return this.board.initPieces(pieces, cubeIndex);
  }

  copy() {
    const rslt = new GamePosition();
    const copyPieces = this.board.pieces.map(p => p.copy());
    rslt.initPosition(copyPieces, this.cubeIndex);
    return rslt;
  }

  printCubePosition() {
    console.log("Cube position is: ", this.getPiece(this.cubeIndex).position);
  }

  canPieceMoveTo(pieceIndex, direction) {
    return this.board.canPieceMoveTo(pieceIndex, direction);
  }

  movePieceTo(pieceIndex, direction) {
    return this.board.movePieceTo(pieceIndex, direction);
  }

  printMove() {
    console.log(
      `Moving pieace: ${this.getPiece(this.move.pieceIndex).name} ${
        DIRECTIONS_MAP[this.move.direction]
      } ${this.move.length} step(s)`
    );
  }

  printGamePosition() {
    this.board.printBoard();
  }

  getHash() {
    const start = Date.now();
    const hash = this.board.getHash();
    hashTime += Date.now() - start;
    return hash;
  }

  getMirrorHash() {
    const start = Date.now();
    const hash = this.board.getMirrorHash();
    hashTime += Date.now() - start;
    return hash;
  }

  reversePlay() {
    const moves = [];
    let curr = this;
    while (curr.parent !== null) {
      moves.unshift(curr);
      curr = curr.parent;
    }
    return moves;
  }
}

let memoryHit = 0;
class Game {
  constructor(initialPosition) {
    this.positions = [initialPosition];
    this.solutions = [];
    this.solutionCounts = 0;
    this.memories = {};
    this.pieceHashMemory = {};
  }

  upsertState(newGamePosition) {
    if (!this.memories[newGamePosition.getHash()]) {
      newGamePosition.index = this.positions.length;
      this.positions.push(newGamePosition);
      this.memories[newGamePosition.getHash()] = newGamePosition;
      this.memories[newGamePosition.getMirrorHash()] = newGamePosition;
      return newGamePosition.getHash();
    } else {
    }
    return null;
  }
}

function findSolution(game) {
  //try each move for each piece.
  let index = 0;
  const start = Date.now();
  while (index < game.positions.length) {
    const curr = game.positions[index];
    // index % 1000 === 0 &&
    //   console.log(
    //     `index: ${index} takes ${(Date.now() - start) /
    //       1000} seconds, hash takes: ${hashTime / 1000} seconds`
    //   );
    if (curr.isResolved()) {
      console.log(`Find a solution: ${index}`);
      game.solutionCounts++;
      game.solutions.push(curr.getHash());
    } else {
      bfsSearchSolution(game, curr);
    }
    index++;
  }
}

const DIRECTIONS = {
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3
};

const DIRECTIONS_MAP = Object.keys(DIRECTIONS).reduce((prev, curr) => {
  prev[DIRECTIONS[curr]] = curr;
  return prev;
}, {});

function bfsSearchSolution(game, gamePosition) {
  gamePosition.getPieces().forEach((p, i) => {
    Object.keys(DIRECTIONS).forEach(d => {
      const newGamePosition = tryToMovePiece(gamePosition, i, DIRECTIONS[d]);
      if (!newGamePosition) {
        return;
      }
      game.upsertState(newGamePosition);
      // continue one step, two same direction step as one step
      const continueGamePosition = tryToMovePiece(
        newGamePosition,
        i,
        DIRECTIONS[d],
        true
      );
      if (!continueGamePosition) {
        return;
      }
      game.upsertState(continueGamePosition);
    });
  });
}

function tryToMovePiece(
  gamePosition,
  pieceIndex,
  direction,
  isContinuing = false
) {
  if (gamePosition.canPieceMoveTo(pieceIndex, direction)) {
    const newGamePosition = gamePosition.copy();
    newGamePosition.movePieceTo(pieceIndex, direction);

    // console.log("to check <<<<<<<<<<<<<<<<<<<<<");
    // gamePosition.printGamePosition();
    // console.log(
    //   `move ${JSON.stringify(gamePosition.getPieces()[pieceIndex])} to ${
    //     DIRECTIONS_MAP[direction]
    //   }`
    // );
    // newGamePosition.printGamePosition();
    // console.log("finish check >>>>>>>>>>>>>>>>>>>>>>>>>>>");

    newGamePosition.parent = gamePosition;
    newGamePosition.step++;
    newGamePosition.move = new Move(pieceIndex, direction, 1);
    if (isContinuing) {
      newGamePosition.parent = gamePosition.parent;
      newGamePosition.step--;
      newGamePosition.move = new Move(pieceIndex, direction, 2);
    }
    return newGamePosition;
  }
  return null;
}

function play(initialPosition, gamePositions) {
  initialPosition.printGamePosition();
  gamePositions.forEach(gp => {
    gp.printMove();
    gp.printGamePosition();
  });
}

function main() {
  const gp = new GamePosition();
  gp.initPosition(gamePositions[1], 1);
  gp.printGamePosition(false);
  const game = new Game(gp);
  findSolution(game);
  const endingPosition = game.memories[game.solutions[0]];
  const plays = endingPosition.reversePlay();
  // play(gp, plays);
  console.log(plays.length);
}
