import React, { PureComponent } from "react";
import { gamePositions, PieceType, Game, GamePosition } from "./klotski";

export default class Board extends PureComponent {
  static width = 200;
  static height = 250;

  constructor(props) {
    super(props);

    this.state = {
      initialPieces: gamePositions[0]
    };
  }

  componentDidMount() {
    const BOARD_WIDTH = 4;
    const BOARD_HEIGHT = 5;
    const gamePosition = new GamePosition(BOARD_WIDTH, BOARD_HEIGHT);
    gamePosition.initPosition(this.state.initialPieces, 1);
    const game = new Game(gamePosition);
    game.findSolution();
    if (game.solutions.length > 0) {
      console.log("solutions found!");
    }
    this.setState({ gamePosition, game });
  }

  handlePlay = () => {
    const { game } = this.state;
    let solution = null;
    if (game.solutions.length > 0) {
      solution = game.memories[game.solutions[0]];
    }
    const plays = solution.reversePlay();
    let step = 0;
    const handle = setInterval(() => {
      if (step < plays.length) {
        console.log("playing, step: ", step + 1);
        this.setState({ initialPieces: plays[step++].getPieces() });
      } else {
        handle && clearInterval(handle);
      }
    }, 100);
  };

  renderBlocks() {
    const gamePieces = this.state.initialPieces;

    const blockWidth = Board.width / this.props.width;
    const blockHeight = Board.height / this.props.height;
    const rslt = gamePieces.map(gamePiece => {
      const style = {};
      const className = ["block"];
      if (gamePiece.type === PieceType.V2) {
        style.width = blockWidth;
        style.height = blockHeight * 2;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("v2");
      } else if (gamePiece.type === PieceType.H2) {
        style.width = blockWidth * 2;
        style.height = blockHeight;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("h2");
      } else if (gamePiece.type === PieceType.CUBE) {
        style.width = blockWidth * 2;
        style.height = blockHeight * 2;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("cube");
      } else if (gamePiece.type === PieceType.BLOCK) {
        style.width = blockWidth;
        style.height = blockHeight;
        style.left = blockWidth * gamePiece.position.left;
        style.top = blockHeight * gamePiece.position.top;
        className.push("blk");
      }
      return (
        <Block
          className={className.join(" ")}
          style={style}
          key={gamePiece.id}
        />
      );
    });
    return rslt;
  }
  render() {
    const blocks = this.renderBlocks();
    return (
      <div>
        <div id="frame">{blocks}</div>
        <div>
          <button
            style={{ width: 80, height: 40, margin: 24, fontSize: 24 }}
            onClick={this.handlePlay}
          >
            Play
          </button>
        </div>
      </div>
    );
  }
}

class Block extends PureComponent {
  render() {
    return <div className={this.props.className} style={this.props.style} />;
  }
}
